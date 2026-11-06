type Props = { error: boolean };

export default function HeroError({ error }: Props) {
  return (
    <section id="acasa" className="mx-auto w-[90%] py-20 text-center">
      <p className="text-neutral-600">
        {error ? "Nu am putut încărca secțiunea principală." : "Conținutul paginii nu este disponibil."}
      </p>
    </section>
  );
}
