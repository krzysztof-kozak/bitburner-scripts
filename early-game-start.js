export async function main(ns) {
  const {
    scan,
    tprint,
    getServerNumPortsRequired,
    getServerRequiredHackingLevel,
    nuke,
    scp,
    exec,
    getServerMaxRam,
    getServerUsedRam,
    getScriptRam,
    killall,
  } = ns;

  // 1. hack the servers with no ports required.
  // 2. deploy hack, grow, and weaken scripts on these servers
  // 3. ???
  // 4. profit
  const servers = scan('home');
  const isVulnerable = (server) =>
    getServerNumPortsRequired(server) < 1 && getServerRequiredHackingLevel(server) <= 20 && server !== 'n00dles';

  const vulnerableServers = servers.filter(isVulnerable);

  vulnerableServers.forEach((server) => {
    const serverMaxRam = getServerMaxRam(server);
    const growRamRequired = getScriptRam('/scripts/perma-grow.js');

    nuke(server);
    scp(['/scripts/perma-weaken.js', '/scripts/perma-grow.js', '/scripts/perma-hack.js'], server);

    killall(server);

    exec('/scripts/perma-weaken.js', server);
    exec('/scripts/perma-hack.js', server);

    let serverUsedRam = getServerUsedRam(server);
    let serverFreeRam = serverMaxRam - serverUsedRam;
    let threads = Math.floor(serverFreeRam / growRamRequired);

    exec('/scripts/perma-grow.js', server, threads);
  });
}
