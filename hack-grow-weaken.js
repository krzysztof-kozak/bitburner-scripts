export async function main(ns) {
  const {
    getRunningScript,
    weaken,
    grow,
    hack,
    tprint,
    hackAnalyzeThreads, // Threads needed to hack the server for hackAmount money.
    hackAnalyzePercent, // Percentage of server’s money stolen with a single hack.
    hackChance, // Chance of successfully hacking the server. In decimal form.
    getServerMoneyAvailable,
    getServerSecurityLevel,
    getServerMaxMoney,
    getServerMaxRam,
  } = ns;

  const {
    threads: THREADS_AVAILABLE, // How many threads this script is being run with (t = x).
    ramUsage: RAM_COST_PER_SCRIPT,
    server: HOST_MACHINE,
  } = getRunningScript();

  const HOST_MACHINE_TOTAL_RAM = getServerMaxRam(HOST_MACHINE);
  const MAX_THREADS_AVAILABLE = Math.floor(HOST_MACHINE_TOTAL_RAM / RAM_COST_PER_SCRIPT); // We can run this script, on this host machine with this many threads (t = x);

  /*
   *Declare target.
   *Declare how much money should the server have before we attempt a hack().
   *Declare a desired hack chance before atempting a hack().
   *Declare a maximum security level treshold before attempting a grow().
   */

  const TARGET = 'joesguns';
  const SERVER_MAX_MONEY = getServerMaxMoney(TARGET);
  const MINIMAL_MONEY_TRESHOLD = SERVER_MAX_MONEY * 0.9;
  const DESIRED_HACK_CHANCE = 0.8;
  const MAX_SECURITY_TRESHHOLD = 20;

  const growCashOnServer = async () => {
    while (getServerMoneyAvailable(TARGET) < MINIMAL_MONEY_TRESHOLD) {
      if (getServerSecurityLevel(TARGET) > MAX_SECURITY_TRESHHOLD) {
        await weaken(TARGET);
      } else {
        await grow(TARGET);
      }
    }
    return getServerMoneyAvailable(TARGET);
  };

  const hackServer = async () => {
    while (hackChance(TARGET) < DESIRED_HACK_CHANCE) {
      await weaken(TARGET);
    }

    let threadsRequired = hackAnalyzeThreads(TARGET, MINIMAL_MONEY_TRESHOLD * 0.25);

    if (threadsRequired < MAX_THREADS_AVAILABLE && threadsRequired > 0) {
      await hack(TARGET, { threads: threadsRequired });
    } else {
      await hack(TARGET, { threads: MAX_THREADS_AVAILABLE });
    }
    return getServerMoneyAvailable(TARGET);
  };

  /*
     1.Grow cash untill the desired treshold.
      1.1. Keep an eye and security level and weaken() if needed.

     2. Hack the server if the chance to hack is >= DESIRED_HACK_CHANCE
      2.1 If chance to hack is not enough, weaken.

     3. When the cash becomes < MINIMAL_MONEY_TRESHOLD, go to step 1.
    */

  while (true) {
    let currentCash = await growCashOnServer();

    while (currentCash >= MINIMAL_MONEY_TRESHOLD) {
      currentCash = await hackServer();
    }
  }
}
