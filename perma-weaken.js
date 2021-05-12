export async function main(ns) {
  const {
    args: [target = 'joesguns'],
    weaken,
    getHostname,
  } = ns;

  while (true) {
    await weaken(target);
  }
}
