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
  } = ns;

  const name = 'host';
  const quantity = 25;
  const cost = nFormat(getPurchasedServerCost(ram) * quantity, '0,00a');
  const answer = await ns.prompt(`Purchase ${quantity} servers for ${cost}?`);
  const serversAlreadyExist = getPurchasedServers().length > 1;

  if (answer && serversAlreadyExist) {
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
    }
  }
}
