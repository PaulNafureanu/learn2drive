import { useEffect, useState } from "react";
import { sanityClient } from "../lib/sanity";

type SanityQueryOptions = {
  loadingQuery: string;
  listeningQuery: string;
  loadingErrorMsg?: string;
  listeningErrorMsg?: string;
};

type SanityQueryResult<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

export function useSanityQuery<T>({
  loadingQuery,
  listeningQuery,
  loadingErrorMsg = "Failed to fetch Sanity data",
  listeningErrorMsg = "Sanity listener error",
}: SanityQueryOptions): SanityQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    let inFlight = false;
    let refreshPending = false;

    async function fetchData() {
      if (controller.signal.aborted || inFlight) return;

      inFlight = true;

      try {
        do {
          refreshPending = false;

          try {
            const result = await sanityClient.fetch<T | null>(
              loadingQuery,
              {},
              {
                signal: controller.signal,
                useCdn: false,
              },
            );

            if (controller.signal.aborted) return;

            setData(result);
            setError(false);
          } catch (err) {
            if (controller.signal.aborted) return;

            console.error(loadingErrorMsg, err);
            setError(true);
          } finally {
            if (!controller.signal.aborted) {
              setLoading(false);
            }
          }
        } while (refreshPending && !controller.signal.aborted);
      } finally {
        inFlight = false;
      }
    }

    function requestRefresh() {
      if (controller.signal.aborted) return;

      refreshPending = true;

      if (!inFlight) {
        void fetchData();
      }
    }

    const subscription = sanityClient
      .listen(
        listeningQuery,
        {},
        {
          includeResult: false,
          visibility: "query",
          events: ["welcome", "mutation", "reconnect"],
        },
      )
      .subscribe({
        next: (event) => {
          if (event.type === "welcome" || event.type === "mutation" || event.type === "reconnect") {
            requestRefresh();
          }
        },
        error: (err) => {
          if (controller.signal.aborted) return;

          console.error(listeningErrorMsg, err);
          setError(true);
        },
      });

    // Initial fetch, even if the listener cannot connect.
    requestRefresh();

    return () => {
      controller.abort();
      subscription.unsubscribe();
    };
  }, [loadingQuery, listeningQuery, loadingErrorMsg, listeningErrorMsg]);

  return { data, loading, error };
}
