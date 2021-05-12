export async function main(ns) {
  const {
    args: [ram, target = 'joesguns'],
    purchaseServer,
    getServerUsedRam,
    getPurchasedServerCost,
    getPurchasedServers,
    getServerMaxRam,
    getScriptRam,
    deleteServer,
    killall,
    nFormat,
    tprint,
    scp,
    exec,
    promp,
  } = ns;

  const name = 'host';
  const quantity = 25;
  const cost = nFormat(getPurchasedServerCost(ram) * quantity, '0,00a');
  const answer = prompt(`Purchase ${quantity} servers for ${cost}?`);
  const serversAlreadyExist = getPurchasedServers().length > 1;

  if (serversAlreadyExist) {
    let servers = getPurchasedServers();

    servers.forEach((server) => {
      killall(server);
      deleteServer(server);
    });
  }

  if (answer) {
    for (let i = 0; i < quantity; i++) {
      let purchasedServer = purchaseServer(`${name}-${ram}-${i}`, ram);
      tprint({ purchasedServer });
      tprint(`${name}-${ram}-${i}`);

      scp(['/scripts/perma-weaken.js', '/scripts/perma-grow.js', '/scripts/perma-hack.js'], purchasedServer);

      let serverMaxRam = getServerMaxRam(purchasedServer);
      let growRamRequired = getScriptRam('/scripts/perma-grow.js');

      exec('/scripts/perma-weaken.js', purchasedServer);
      exec('/scripts/perma-hack.js', purchasedServer);

      let serverUsedRam = getServerUsedRam(purchasedServer);
      let serverFreeRam = serverMaxRam - serverUsedRam;
      let threads = Math.floor(serverFreeRam / growRamRequired);

      exec('/scripts/perma-grow.js', purchasedServer, threads, target);
    }
  }
}
