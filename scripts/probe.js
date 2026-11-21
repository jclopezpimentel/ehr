(async () => {
  const out = {};
  out.globals = Object.getOwnPropertyNames(globalThis).filter(g =>
    ["remix", "web3", "Web3", "ethers", "provider", "contract", "contracts", "getContractManager", "accounts", "window"].includes(g)
  );
  if (typeof web3 !== "undefined") {
    out.ethAccounts = await web3.eth.getAccounts();
  }
  if (typeof ethers !== "undefined") {
    out.ethersVersion = ethers.version;
  }
  console.log(JSON.stringify(out, null, 2));
})();
