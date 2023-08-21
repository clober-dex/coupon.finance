/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  AaveTokenSubstitute,
  AaveTokenSubstituteInterface,
} from "../../contracts/AaveTokenSubstitute";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "asset_",
        type: "address",
      },
      {
        internalType: "address",
        name: "aaveV3Pool_",
        type: "address",
      },
      {
        internalType: "address",
        name: "treasury_",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "aToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "burnToAToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "burnableAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "mintByAToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintableAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "underlyingToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101e06040523480156200001257600080fd5b50604051620030e7380380620030e7833981016040819052620000359162000501565b836001600160a01b03166306fdde036040518163ffffffff1660e01b8152600401600060405180830381865afa15801562000074573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526200009e9190810190620005c6565b604051602001620000b091906200067e565b60405160208183030381529060405280604051806040016040528060018152602001603160f81b815250866001600160a01b03166306fdde036040518163ffffffff1660e01b8152600401600060405180830381865afa15801562000119573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620001439190810190620005c6565b6040516020016200015591906200067e565b604051602081830303815290604052876001600160a01b03166395d89b416040518163ffffffff1660e01b8152600401600060405180830381865afa158015620001a3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620001cd9190810190620005c6565b604051602001620001df9190620006b5565b60408051601f198184030181529190526003620001fd838262000770565b5060046200020c828262000770565b506200021e915083905060056200040d565b610120526200022f8160066200040d565b61014052815160208084019190912060e052815190820120610100524660a052620002bd60e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c05250620002d23362000446565b6001600160a01b038381166101608190526040516335ea6a7560e01b81529186166004830152906335ea6a75906024016101e060405180830381865afa15801562000321573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003479190620008c2565b61010001516001600160a01b03166101a0816001600160a01b031681525050836001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015620003a5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003cb919062000a06565b60ff16610180526001600160a01b038481166101c052600a80546001600160a01b031916918416919091179055620004038162000446565b5050505062000a8c565b60006020835110156200042d57620004258362000498565b905062000440565b816200043a848262000770565b5060ff90505b92915050565b600980546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600080829050601f81511115620004cf578260405163305a27a960e01b8152600401620004c6919062000a32565b60405180910390fd5b8051620004dc8262000a67565b179392505050565b80516001600160a01b0381168114620004fc57600080fd5b919050565b600080600080608085870312156200051857600080fd5b6200052385620004e4565b93506200053360208601620004e4565b92506200054360408601620004e4565b91506200055360608601620004e4565b905092959194509250565b634e487b7160e01b600052604160045260246000fd5b6040516101e081016001600160401b03811182821017156200059a576200059a6200055e565b60405290565b60005b83811015620005bd578181015183820152602001620005a3565b50506000910152565b600060208284031215620005d957600080fd5b81516001600160401b0380821115620005f157600080fd5b818401915084601f8301126200060657600080fd5b8151818111156200061b576200061b6200055e565b604051601f8201601f19908116603f011681019083821181831017156200064657620006466200055e565b816040528281528760208487010111156200066057600080fd5b62000673836020830160208801620005a0565b979650505050505050565b6c02bb930b83832b21020b0bb329609d1b815260008251620006a881600d850160208701620005a0565b91909101600d0192915050565b61576160f01b815260008251620006d4816002850160208701620005a0565b9190910160020192915050565b600181811c90821680620006f657607f821691505b6020821081036200071757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200076b57600081815260208120601f850160051c81016020861015620007465750805b601f850160051c820191505b81811015620007675782815560010162000752565b5050505b505050565b81516001600160401b038111156200078c576200078c6200055e565b620007a4816200079d8454620006e1565b846200071d565b602080601f831160018114620007dc5760008415620007c35750858301515b600019600386901b1c1916600185901b17855562000767565b600085815260208120601f198616915b828110156200080d57888601518255948401946001909101908401620007ec565b50858210156200082c5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6000602082840312156200084f57600080fd5b604051602081016001600160401b03811182821017156200087457620008746200055e565b6040529151825250919050565b80516001600160801b0381168114620004fc57600080fd5b805164ffffffffff81168114620004fc57600080fd5b805161ffff81168114620004fc57600080fd5b60006101e08284031215620008d657600080fd5b620008e062000574565b620008ec84846200083c565b8152620008fc6020840162000881565b60208201526200090f6040840162000881565b6040820152620009226060840162000881565b6060820152620009356080840162000881565b60808201526200094860a0840162000881565b60a08201526200095b60c0840162000899565b60c08201526200096e60e08401620008af565b60e082015261010062000983818501620004e4565b9082015261012062000997848201620004e4565b90820152610140620009ab848201620004e4565b90820152610160620009bf848201620004e4565b90820152610180620009d384820162000881565b908201526101a0620009e784820162000881565b908201526101c0620009fb84820162000881565b908201529392505050565b60006020828403121562000a1957600080fd5b815160ff8116811462000a2b57600080fd5b9392505050565b602081526000825180602084015262000a53816040850160208701620005a0565b601f01601f19169190910160400192915050565b80516020808301519190811015620007175760001960209190910360031b1b16919050565b60805160a05160c05160e05161010051610120516101405161016051610180516101a0516101c05161257262000b756000396000818161025401528181610844015281816108cb0152818161096901528181610b0701528181610e3d0152610ee40152600081816103980152818161048c015281816105f7015281816106af0152818161072e0152610e120152600061029501526000818161089c015281816109a501528181610b340152610f1b015260006107cb015260006107a0015260006116370152600061160f0152600061156a01526000611594015260006115be01526125726000f3fe608060405234801561001057600080fd5b50600436106101cf5760003560e01c80637ecebe0011610104578063a9059cbb116100a2578063f0f4426011610071578063f0f4426014610434578063f2fde38b14610447578063fab5ae741461045a578063fcd3533c1461046257600080fd5b8063a9059cbb146103cd578063ae3baf4d146103e0578063d505accf146103e8578063dd62ed3e146103fb57600080fd5b806394bf804d116100de57806394bf804d1461037857806395d89b411461038b578063a0c1f15e14610393578063a457c2d7146103ba57600080fd5b80637ecebe001461033957806384b0196e1461034c5780638da5cb5b1461036757600080fd5b80633644e5151161017157806361d027b31161014b57806361d027b3146102e25780636bba7dc0146102f557806370a0823114610308578063715018a61461033157600080fd5b80633644e515146102bf57806339509351146102c75780634e71d92d146102da57600080fd5b806318160ddd116101ad57806318160ddd1461022a57806323b872dd1461023c5780632495a5991461024f578063313ce5671461028e57600080fd5b806305c77fa0146101d457806306fdde03146101e9578063095ea7b314610207575b600080fd5b6101e76101e2366004611edb565b610475565b005b6101f16104b7565b6040516101fe9190611f5b565b60405180910390f35b61021a610215366004611f75565b610549565b60405190151581526020016101fe565b6002545b6040519081526020016101fe565b61021a61024a366004611fa1565b610563565b6102767f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016101fe565b60405160ff7f00000000000000000000000000000000000000000000000000000000000000001681526020016101fe565b61022e610587565b61021a6102d5366004611f75565b610596565b6101e76105d5565b600a54610276906001600160a01b031681565b6101e7610303366004611edb565b610721565b61022e610316366004611fe2565b6001600160a01b031660009081526020819052604090205490565b6101e7610760565b61022e610347366004611fe2565b610774565b610354610792565b6040516101fe9796959493929190611fff565b6009546001600160a01b0316610276565b6101e7610386366004611edb565b610837565b6101f1610a0b565b6102767f000000000000000000000000000000000000000000000000000000000000000081565b61021a6103c8366004611f75565b610a1a565b61021a6103db366004611f75565b610ac9565b61022e610ad7565b6101e76103f63660046120b1565b610bd3565b61022e610409366004612128565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101e7610442366004611fe2565b610d37565b6101e7610455366004611fe2565b610d6e565b61022e610dfb565b6101e7610470366004611edb565b610eaa565b61047f3383610f8d565b6104b36001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001682846110f6565b5050565b6060600380546104c690612156565b80601f01602080910402602001604051908101604052809291908181526020018280546104f290612156565b801561053f5780601f106105145761010080835404028352916020019161053f565b820191906000526020600020905b81548152906001019060200180831161052257829003601f168201915b5050505050905090565b600033610557818585611186565b60019150505b92915050565b6000336105718582856112de565b61057c858585611370565b506001949350505050565b600061059161155d565b905090565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061055790829086906105d09087906121a0565b611186565b600060016105e260025490565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610646573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066a91906121b3565b61067491906121cc565b61067e91906121cc565b9050801561071e57600a5460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb906044016020604051808303816000875af11580156106fa573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b391906121df565b50565b6107566001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016333085611688565b6104b381836116d9565b610768611798565b61077260006117f2565b565b6001600160a01b03811660009081526007602052604081205461055d565b6000606080828080836107c67f00000000000000000000000000000000000000000000000000000000000000006005611851565b6107f17f00000000000000000000000000000000000000000000000000000000000000006006611851565b604080516000808252602082019092527f0f000000000000000000000000000000000000000000000000000000000000009b939a50919850469750309650945092509050565b61086c6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016333085611688565b6040517f095ea7b30000000000000000000000000000000000000000000000000000000081526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018490527f0000000000000000000000000000000000000000000000000000000000000000169063095ea7b3906044016020604051808303816000875af1158015610914573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061093891906121df565b506040517f617ba0370000000000000000000000000000000000000000000000000000000081526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116600483015260248201849052306044830152600060648301527f0000000000000000000000000000000000000000000000000000000000000000169063617ba03790608401600060405180830381600087803b1580156109e957600080fd5b505af11580156109fd573d6000803e3d6000fd5b505050506104b381836116d9565b6060600480546104c690612156565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919083811015610abc5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b61057c8286868403611186565b600033610557818585611370565b6040517f35ea6a750000000000000000000000000000000000000000000000000000000081526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116600483015260009182917f000000000000000000000000000000000000000000000000000000000000000016906335ea6a75906024016101e060405180830381865afa158015610b7c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ba091906122e0565b51805190915060301c60ff16610bb790600a6124e7565b815160741c640fffffffff16610bcd91906124f3565b91505090565b83421115610c235760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610ab3565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9888888610c528c6118fc565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610cad82611924565b90506000610cbd8287878761196c565b9050896001600160a01b0316816001600160a01b031614610d205760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610ab3565b610d2b8a8a8a611186565b50505050505050505050565b610d3f611798565b600a805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b610d76611798565b6001600160a01b038116610df25760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610ab3565b61071e816117f2565b6040516370a0823160e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526000917f0000000000000000000000000000000000000000000000000000000000000000909116906370a0823190602401602060405180830381865afa158015610e86573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061059191906121b3565b610eb43383610f8d565b6040517f69328dec0000000000000000000000000000000000000000000000000000000081526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820184905282811660448301527f000000000000000000000000000000000000000000000000000000000000000016906369328dec906064016020604051808303816000875af1158015610f64573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f8891906121b3565b505050565b6001600160a01b0382166110095760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b038216600090815260208190526040902054818110156110985760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f63650000000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3505050565b6040516001600160a01b038316602482015260448101829052610f8890849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152611996565b6001600160a01b0383166112015760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b03821661127d5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b03838116600090815260016020908152604080832093861683529290522054600019811461136a578181101561135d5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610ab3565b61136a8484848403611186565b50505050565b6001600160a01b0383166113ec5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b0382166114685760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b038316600090815260208190526040902054818110156114f75760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152608401610ab3565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a361136a565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156115b657507f000000000000000000000000000000000000000000000000000000000000000046145b156115e057507f000000000000000000000000000000000000000000000000000000000000000090565b610591604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6040516001600160a01b038085166024830152831660448201526064810182905261136a9085907f23b872dd0000000000000000000000000000000000000000000000000000000090608401611122565b6001600160a01b03821661172f5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610ab3565b806002600082825461174191906121a0565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6009546001600160a01b031633146107725760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610ab3565b600980546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b606060ff831461186b5761186483611a7e565b905061055d565b81805461187790612156565b80601f01602080910402602001604051908101604052809291908181526020018280546118a390612156565b80156118f05780601f106118c5576101008083540402835291602001916118f0565b820191906000526020600020905b8154815290600101906020018083116118d357829003601f168201915b5050505050905061055d565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b600061055d61193161155d565b836040517f19010000000000000000000000000000000000000000000000000000000000008152600281019290925260228201526042902090565b600080600061197d87878787611abd565b9150915061198a81611b81565b5090505b949350505050565b60006119eb826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611ce69092919063ffffffff16565b9050805160001480611a0c575080806020019051810190611a0c91906121df565b610f885760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610ab3565b60606000611a8b83611cf5565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115611af45750600090506003611b78565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611b48573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611b7157600060019250925050611b78565b9150600090505b94509492505050565b6000816004811115611b9557611b9561250a565b03611b9d5750565b6001816004811115611bb157611bb161250a565b03611bfe5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610ab3565b6002816004811115611c1257611c1261250a565b03611c5f5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610ab3565b6003816004811115611c7357611c7361250a565b0361071e5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610ab3565b606061198e8484600085611d36565b600060ff8216601f81111561055d576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b606082471015611dae5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610ab3565b600080866001600160a01b03168587604051611dca9190612520565b60006040518083038185875af1925050503d8060008114611e07576040519150601f19603f3d011682016040523d82523d6000602084013e611e0c565b606091505b5091509150611e1d87838387611e28565b979650505050505050565b60608315611e97578251600003611e90576001600160a01b0385163b611e905760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610ab3565b508161198e565b61198e8383815115611eac5781518083602001fd5b8060405162461bcd60e51b8152600401610ab39190611f5b565b6001600160a01b038116811461071e57600080fd5b60008060408385031215611eee57600080fd5b823591506020830135611f0081611ec6565b809150509250929050565b60005b83811015611f26578181015183820152602001611f0e565b50506000910152565b60008151808452611f47816020860160208601611f0b565b601f01601f19169290920160200192915050565b602081526000611f6e6020830184611f2f565b9392505050565b60008060408385031215611f8857600080fd5b8235611f9381611ec6565b946020939093013593505050565b600080600060608486031215611fb657600080fd5b8335611fc181611ec6565b92506020840135611fd181611ec6565b929592945050506040919091013590565b600060208284031215611ff457600080fd5b8135611f6e81611ec6565b7fff00000000000000000000000000000000000000000000000000000000000000881681526000602060e08184015261203b60e084018a611f2f565b838103604085015261204d818a611f2f565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b8181101561209f57835183529284019291840191600101612083565b50909c9b505050505050505050505050565b600080600080600080600060e0888a0312156120cc57600080fd5b87356120d781611ec6565b965060208801356120e781611ec6565b95506040880135945060608801359350608088013560ff8116811461210b57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561213b57600080fd5b823561214681611ec6565b91506020830135611f0081611ec6565b600181811c9082168061216a57607f821691505b60208210810361191e57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561055d5761055d61218a565b6000602082840312156121c557600080fd5b5051919050565b8181038181111561055d5761055d61218a565b6000602082840312156121f157600080fd5b81518015158114611f6e57600080fd5b6040516101e0810167ffffffffffffffff8111828210171561223357634e487b7160e01b600052604160045260246000fd5b60405290565b60006020828403121561224b57600080fd5b6040516020810181811067ffffffffffffffff8211171561227c57634e487b7160e01b600052604160045260246000fd5b6040529151825250919050565b80516fffffffffffffffffffffffffffffffff811681146122a957600080fd5b919050565b805164ffffffffff811681146122a957600080fd5b805161ffff811681146122a957600080fd5b80516122a981611ec6565b60006101e082840312156122f357600080fd5b6122fb612201565b6123058484612239565b815261231360208401612289565b602082015261232460408401612289565b604082015261233560608401612289565b606082015261234660808401612289565b608082015261235760a08401612289565b60a082015261236860c084016122ae565b60c082015261237960e084016122c3565b60e082015261010061238c8185016122d5565b9082015261012061239e8482016122d5565b908201526101406123b08482016122d5565b908201526101606123c28482016122d5565b908201526101806123d4848201612289565b908201526101a06123e6848201612289565b908201526101c06123f8848201612289565b908201529392505050565b600181815b8085111561243e5781600019048211156124245761242461218a565b8085161561243157918102915b93841c9390800290612408565b509250929050565b6000826124555750600161055d565b816124625750600061055d565b816001811461247857600281146124825761249e565b600191505061055d565b60ff8411156124935761249361218a565b50506001821b61055d565b5060208310610133831016604e8410600b84101617156124c1575081810a61055d565b6124cb8383612403565b80600019048211156124df576124df61218a565b029392505050565b6000611f6e8383612446565b808202811582820484141761055d5761055d61218a565b634e487b7160e01b600052602160045260246000fd5b60008251612532818460208701611f0b565b919091019291505056fea2646970667358221220859ca95f20144bbde699951e8b37258d46f8ad59af78c4ebbd130d34720c7add64736f6c63430008130033";

type AaveTokenSubstituteConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AaveTokenSubstituteConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AaveTokenSubstitute__factory extends ContractFactory {
  constructor(...args: AaveTokenSubstituteConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    asset_: PromiseOrValue<string>,
    aaveV3Pool_: PromiseOrValue<string>,
    treasury_: PromiseOrValue<string>,
    owner_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AaveTokenSubstitute> {
    return super.deploy(
      asset_,
      aaveV3Pool_,
      treasury_,
      owner_,
      overrides || {}
    ) as Promise<AaveTokenSubstitute>;
  }
  override getDeployTransaction(
    asset_: PromiseOrValue<string>,
    aaveV3Pool_: PromiseOrValue<string>,
    treasury_: PromiseOrValue<string>,
    owner_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      asset_,
      aaveV3Pool_,
      treasury_,
      owner_,
      overrides || {}
    );
  }
  override attach(address: string): AaveTokenSubstitute {
    return super.attach(address) as AaveTokenSubstitute;
  }
  override connect(signer: Signer): AaveTokenSubstitute__factory {
    return super.connect(signer) as AaveTokenSubstitute__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AaveTokenSubstituteInterface {
    return new utils.Interface(_abi) as AaveTokenSubstituteInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AaveTokenSubstitute {
    return new Contract(address, _abi, signerOrProvider) as AaveTokenSubstitute;
  }
}