type Props = { error: boolean };

export default function ErrorNav({ error }: Props) {
  return (
    <div>
      {error && (
        <p role="alert" className="px-6 py-2 text-sm text-red-600">
          Nu am putut încărca meniul.
        </p>
      )}
    </div>
  );
}
