export function asMutable(f) {
  return (...a) => f(...a).toObject();
}