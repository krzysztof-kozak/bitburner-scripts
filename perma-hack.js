export async function main(ns) {
  const {
    args: [target = 'joesguns'],
    getServerMoneyAvailable,
    getServerMaxMoney,
    hackAnalyzeThreads,
    hack,
    sleep,
    getRunningScript,
    getPurchasedServers,
  } = ns;

  const TARGET = target;
  const NUM_OF_SERVERS = getPurchasedServers().length;
  const { threads } = getRunningScript();

  while (true) {
    let serverMaxMoney = getServerMaxMoney(TARGET);
    let serverCurrentMoney = getServerMoneyAvailable(TARGET);
    let required_threads = hackAnalyzeThreads(TARGET, (serverCurrentMoney * 0.1) / NUM_OF_SERVERS);

    if (required_threads > threads || required_threads < 1) {
      required_threads = threads;
    }

    if (serverCurrentMoney < serverMaxMoney * 0.75) {
      await sleep(Math.floor(Math.random() * (11 - 2) + 2) * 1000);
      continue;
    }

    await hack(TARGET, { threads: required_threads });
  }
}
