export async function main(ns) {
  const {
    args: [target],
    weaken,
    getHostname,
  } = ns;

  while (true) {
    await weaken(target);
  }
}
