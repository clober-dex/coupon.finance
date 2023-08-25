/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { AssetPool, AssetPoolInterface } from "../../contracts/AssetPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "operators",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidAccess",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isOperator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161070838038061070883398101604081905261002f916100cd565b60005b815181101561009457600160008084848151811061005257610052610191565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905561008d816101a7565b9050610032565b50506101ce565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146100c857600080fd5b919050565b600060208083850312156100e057600080fd5b82516001600160401b03808211156100f757600080fd5b818501915085601f83011261010b57600080fd5b81518181111561011d5761011d61009b565b8060051b604051601f19603f830116810181811085821117156101425761014261009b565b60405291825284820192508381018501918883111561016057600080fd5b938501935b8285101561018557610176856100b1565b84529385019392850192610165565b98975050505050505050565b634e487b7160e01b600052603260045260246000fd5b6000600182016101c757634e487b7160e01b600052601160045260246000fd5b5060010190565b61052b806101dd6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806369328dec1461003b5780636d70f7ae14610050575b600080fd5b61004e610049366004610402565b610087565b005b61007361005e36600461043e565b60006020819052908152604090205460ff1681565b604051901515815260200160405180910390f35b3360009081526020819052604090205460ff166100d0576040517fc0185c6400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6100e46001600160a01b03841682846100e9565b505050565b604080516001600160a01b03848116602483015260448083018590528351808403909101815260649092018352602080830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb0000000000000000000000000000000000000000000000000000000017905283518085019094528084527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564908401526100e4928692916000916101a791851690849061023f565b90508051600014806101c85750808060200190518101906101c89190610460565b6100e45760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f7420737563636565640000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b606061024e8484600085610256565b949350505050565b6060824710156102ce5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610236565b600080866001600160a01b031685876040516102ea91906104a6565b60006040518083038185875af1925050503d8060008114610327576040519150601f19603f3d011682016040523d82523d6000602084013e61032c565b606091505b509150915061033d87838387610348565b979650505050505050565b606083156103b75782516000036103b0576001600160a01b0385163b6103b05760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610236565b508161024e565b61024e83838151156103cc5781518083602001fd5b8060405162461bcd60e51b815260040161023691906104c2565b80356001600160a01b03811681146103fd57600080fd5b919050565b60008060006060848603121561041757600080fd5b610420846103e6565b925060208401359150610435604085016103e6565b90509250925092565b60006020828403121561045057600080fd5b610459826103e6565b9392505050565b60006020828403121561047257600080fd5b8151801515811461045957600080fd5b60005b8381101561049d578181015183820152602001610485565b50506000910152565b600082516104b8818460208701610482565b9190910192915050565b60208152600082518060208401526104e1816040850160208701610482565b601f01601f1916919091016040019291505056fea26469706673582212203fbd0497e9019ecd370581150c7acb6eabba77214ec64c20fcd283ef6bb6034464736f6c63430008130033";

type AssetPoolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AssetPoolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AssetPool__factory extends ContractFactory {
  constructor(...args: AssetPoolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    operators: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AssetPool> {
    return super.deploy(operators, overrides || {}) as Promise<AssetPool>;
  }
  override getDeployTransaction(
    operators: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(operators, overrides || {});
  }
  override attach(address: string): AssetPool {
    return super.attach(address) as AssetPool;
  }
  override connect(signer: Signer): AssetPool__factory {
    return super.connect(signer) as AssetPool__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AssetPoolInterface {
    return new utils.Interface(_abi) as AssetPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AssetPool {
    return new Contract(address, _abi, signerOrProvider) as AssetPool;
  }
}
