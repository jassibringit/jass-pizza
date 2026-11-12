// The "→" on pill buttons. Nudges right when the parent has `group` and is hovered.
export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
    >
      →
    </span>
  );
}
