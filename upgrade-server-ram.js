export async function main(ns) {
  const {
    args: [ram],
    deleteServer,
    purchaseServer,
    getPurchasedServers,
    killall,
    tprint,
    getPurchasedServerCost,
    nFormat,
    prompt,
  } = ns;

  const oldServers = getPurchasedServers();
  const quantity = oldServers.length;
  const cost = nFormat(getPurchasedServerCost(ram) * quantity, '0,00a');
  const answer = await prompt(`Upgrade ${quantity} servers for ${cost}?`);
  const name = 'host';

  if (answer) {
    let serverIndex = 0;
    oldServers.forEach((oldServer) => {
      tprint(`All scripts killed on ${oldServer}: ${killall(oldServer)}`);
      tprint(`Old Server ${oldServer} deleted: ${deleteServer(oldServer)}`);

      let newServer = purchaseServer(`${name}-${ram}-${serverIndex}`, ram);
      tprint(`Purchased ${newServer} with ${ram}GB ram.`);
      tprint('\n');

      serverIndex++;
    });
  }
}
