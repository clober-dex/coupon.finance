/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1271",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1271__factory>;
    getContractFactory(
      name: "IERC5267",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC5267__factory>;
    getContractFactory(
      name: "ERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155__factory>;
    getContractFactory(
      name: "ERC1155Supply",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Supply__factory>;
    getContractFactory(
      name: "IERC1155MetadataURI",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURI__factory>;
    getContractFactory(
      name: "IERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "ERC1155Holder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Holder__factory>;
    getContractFactory(
      name: "ERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Receiver__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "EIP712",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EIP712__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ShortStrings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ShortStrings__factory>;
    getContractFactory(
      name: "AaveTokenSubstitute",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AaveTokenSubstitute__factory>;
    getContractFactory(
      name: "AssetPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AssetPool__factory>;
    getContractFactory(
      name: "BondPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BondPositionManager__factory>;
    getContractFactory(
      name: "BorrowController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BorrowController__factory>;
    getContractFactory(
      name: "CouponManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CouponManager__factory>;
    getContractFactory(
      name: "CouponOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CouponOracle__factory>;
    getContractFactory(
      name: "DepositController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DepositController__factory>;
    getContractFactory(
      name: "Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Errors__factory>;
    getContractFactory(
      name: "IAToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAToken__factory>;
    getContractFactory(
      name: "IPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPool__factory>;
    getContractFactory(
      name: "IPoolAddressesProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPoolAddressesProvider__factory>;
    getContractFactory(
      name: "ReserveConfiguration",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReserveConfiguration__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "CloberMarketFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloberMarketFactory__factory>;
    getContractFactory(
      name: "CloberMarketSwapCallbackReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloberMarketSwapCallbackReceiver__factory>;
    getContractFactory(
      name: "CloberOrderBook",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloberOrderBook__factory>;
    getContractFactory(
      name: "CloberRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CloberRouter__factory>;
    getContractFactory(
      name: "ISingletonFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISingletonFactory__factory>;
    getContractFactory(
      name: "ISwapRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISwapRouter__factory>;
    getContractFactory(
      name: "IUniswapV3SwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3SwapCallback__factory>;
    getContractFactory(
      name: "IWETH9",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETH9__factory>;
    getContractFactory(
      name: "IWrapped1155Factory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWrapped1155Factory__factory>;
    getContractFactory(
      name: "IAaveTokenSubstitute",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAaveTokenSubstitute__factory>;
    getContractFactory(
      name: "IAssetPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAssetPool__factory>;
    getContractFactory(
      name: "IBondPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBondPositionManager__factory>;
    getContractFactory(
      name: "IBondPositionManagerTypes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBondPositionManagerTypes__factory>;
    getContractFactory(
      name: "IBorrowController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBorrowController__factory>;
    getContractFactory(
      name: "IController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IController__factory>;
    getContractFactory(
      name: "ICouponManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICouponManager__factory>;
    getContractFactory(
      name: "ICouponOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICouponOracle__factory>;
    getContractFactory(
      name: "IDepositController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDepositController__factory>;
    getContractFactory(
      name: "IERC1155Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Permit__factory>;
    getContractFactory(
      name: "IERC721Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Permit__factory>;
    getContractFactory(
      name: "IFallbackOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFallbackOracle__factory>;
    getContractFactory(
      name: "ILoanPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILoanPositionManager__factory>;
    getContractFactory(
      name: "ILoanPositionManagerTypes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILoanPositionManagerTypes__factory>;
    getContractFactory(
      name: "IPositionLocker",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPositionLocker__factory>;
    getContractFactory(
      name: "IPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPositionManager__factory>;
    getContractFactory(
      name: "IPositionManagerTypes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPositionManagerTypes__factory>;
    getContractFactory(
      name: "IRepayAdapter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRepayAdapter__factory>;
    getContractFactory(
      name: "ISubstitute",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISubstitute__factory>;
    getContractFactory(
      name: "BondPositionLibrary",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BondPositionLibrary__factory>;
    getContractFactory(
      name: "Controller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Controller__factory>;
    getContractFactory(
      name: "EpochLibrary",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EpochLibrary__factory>;
    getContractFactory(
      name: "ERC1155Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155Permit__factory>;
    getContractFactory(
      name: "ERC721Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Permit__factory>;
    getContractFactory(
      name: "LoanPositionLibrary",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LoanPositionLibrary__factory>;
    getContractFactory(
      name: "PositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PositionManager__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "LoanPositionManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LoanPositionManager__factory>;
    getContractFactory(
      name: "OdosRepayAdapter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OdosRepayAdapter__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1271",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1271>;
    getContractAt(
      name: "IERC5267",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC5267>;
    getContractAt(
      name: "ERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155>;
    getContractAt(
      name: "ERC1155Supply",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Supply>;
    getContractAt(
      name: "IERC1155MetadataURI",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURI>;
    getContractAt(
      name: "IERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "ERC1155Holder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Holder>;
    getContractAt(
      name: "ERC1155Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Receiver>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "EIP712",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EIP712>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "ShortStrings",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ShortStrings>;
    getContractAt(
      name: "AaveTokenSubstitute",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AaveTokenSubstitute>;
    getContractAt(
      name: "AssetPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AssetPool>;
    getContractAt(
      name: "BondPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BondPositionManager>;
    getContractAt(
      name: "BorrowController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BorrowController>;
    getContractAt(
      name: "CouponManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CouponManager>;
    getContractAt(
      name: "CouponOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CouponOracle>;
    getContractAt(
      name: "DepositController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DepositController>;
    getContractAt(
      name: "Errors",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Errors>;
    getContractAt(
      name: "IAToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAToken>;
    getContractAt(
      name: "IPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPool>;
    getContractAt(
      name: "IPoolAddressesProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPoolAddressesProvider>;
    getContractAt(
      name: "ReserveConfiguration",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReserveConfiguration>;
    getContractAt(
      name: "AggregatorV3Interface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AggregatorV3Interface>;
    getContractAt(
      name: "CloberMarketFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloberMarketFactory>;
    getContractAt(
      name: "CloberMarketSwapCallbackReceiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloberMarketSwapCallbackReceiver>;
    getContractAt(
      name: "CloberOrderBook",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloberOrderBook>;
    getContractAt(
      name: "CloberRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CloberRouter>;
    getContractAt(
      name: "ISingletonFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISingletonFactory>;
    getContractAt(
      name: "ISwapRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISwapRouter>;
    getContractAt(
      name: "IUniswapV3SwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    getContractAt(
      name: "IWETH9",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETH9>;
    getContractAt(
      name: "IWrapped1155Factory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWrapped1155Factory>;
    getContractAt(
      name: "IAaveTokenSubstitute",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAaveTokenSubstitute>;
    getContractAt(
      name: "IAssetPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAssetPool>;
    getContractAt(
      name: "IBondPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBondPositionManager>;
    getContractAt(
      name: "IBondPositionManagerTypes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBondPositionManagerTypes>;
    getContractAt(
      name: "IBorrowController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBorrowController>;
    getContractAt(
      name: "IController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IController>;
    getContractAt(
      name: "ICouponManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICouponManager>;
    getContractAt(
      name: "ICouponOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICouponOracle>;
    getContractAt(
      name: "IDepositController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDepositController>;
    getContractAt(
      name: "IERC1155Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Permit>;
    getContractAt(
      name: "IERC721Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Permit>;
    getContractAt(
      name: "IFallbackOracle",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFallbackOracle>;
    getContractAt(
      name: "ILoanPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ILoanPositionManager>;
    getContractAt(
      name: "ILoanPositionManagerTypes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ILoanPositionManagerTypes>;
    getContractAt(
      name: "IPositionLocker",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPositionLocker>;
    getContractAt(
      name: "IPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPositionManager>;
    getContractAt(
      name: "IPositionManagerTypes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPositionManagerTypes>;
    getContractAt(
      name: "IRepayAdapter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRepayAdapter>;
    getContractAt(
      name: "ISubstitute",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISubstitute>;
    getContractAt(
      name: "BondPositionLibrary",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BondPositionLibrary>;
    getContractAt(
      name: "Controller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Controller>;
    getContractAt(
      name: "EpochLibrary",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EpochLibrary>;
    getContractAt(
      name: "ERC1155Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155Permit>;
    getContractAt(
      name: "ERC721Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Permit>;
    getContractAt(
      name: "LoanPositionLibrary",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LoanPositionLibrary>;
    getContractAt(
      name: "PositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PositionManager>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "LoanPositionManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LoanPositionManager>;
    getContractAt(
      name: "OdosRepayAdapter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OdosRepayAdapter>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
