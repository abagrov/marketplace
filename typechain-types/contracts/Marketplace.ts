/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export declare namespace Marketplace {
  export type AuctionItemStruct = {
    topBidderSum: BigNumberish;
    bidsNum: BigNumberish;
    deadline: BigNumberish;
    topBidder: string;
  };

  export type AuctionItemStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    string
  ] & {
    topBidderSum: BigNumber;
    bidsNum: BigNumber;
    deadline: BigNumber;
    topBidder: string;
  };

  export type MarketplaceItemStruct = {
    itemId: BigNumberish;
    tokenId: BigNumberish;
    price: BigNumberish;
    amount: BigNumberish;
    owner: string;
    contractType: BigNumberish;
    isAvailable: boolean;
    isInAuction: boolean;
    name: string;
  };

  export type MarketplaceItemStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    number,
    boolean,
    boolean,
    string
  ] & {
    itemId: BigNumber;
    tokenId: BigNumber;
    price: BigNumber;
    amount: BigNumber;
    owner: string;
    contractType: number;
    isAvailable: boolean;
    isInAuction: boolean;
    name: string;
  };
}

export interface MarketplaceInterface extends utils.Interface {
  functions: {
    "buyItem(uint256)": FunctionFragment;
    "cancel(uint256)": FunctionFragment;
    "cancelAuction(uint256)": FunctionFragment;
    "createItem(string,uint256,string,uint8,uint256)": FunctionFragment;
    "finishAuction(uint256)": FunctionFragment;
    "listItem(uint256)": FunctionFragment;
    "listItemOnAuction(uint256)": FunctionFragment;
    "makeBid(uint256)": FunctionFragment;
    "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "onERC1155Received(address,address,uint256,uint256,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "buyItem"
      | "cancel"
      | "cancelAuction"
      | "createItem"
      | "finishAuction"
      | "listItem"
      | "listItemOnAuction"
      | "makeBid"
      | "onERC1155BatchReceived"
      | "onERC1155Received"
      | "supportsInterface"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buyItem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createItem",
    values: [string, BigNumberish, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "finishAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "listItem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "listItemOnAuction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "makeBid",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155BatchReceived",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155Received",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "buyItem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "finishAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "listItem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "listItemOnAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "makeBid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155BatchReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "AuctionCanceled(tuple,tuple)": EventFragment;
    "AuctionCreated(tuple,tuple)": EventFragment;
    "AuctionFinished(tuple,tuple)": EventFragment;
    "BidMade(tuple)": EventFragment;
    "ItemBought(tuple,address)": EventFragment;
    "ItemCreated(tuple)": EventFragment;
    "ItemListed(tuple)": EventFragment;
    "ItemUnlisted(tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AuctionCanceled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionFinished"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BidMade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemListed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ItemUnlisted"): EventFragment;
}

export interface AuctionCanceledEventObject {
  auction: Marketplace.AuctionItemStructOutput;
  item: Marketplace.MarketplaceItemStructOutput;
}
export type AuctionCanceledEvent = TypedEvent<
  [
    Marketplace.AuctionItemStructOutput,
    Marketplace.MarketplaceItemStructOutput
  ],
  AuctionCanceledEventObject
>;

export type AuctionCanceledEventFilter = TypedEventFilter<AuctionCanceledEvent>;

export interface AuctionCreatedEventObject {
  auction: Marketplace.AuctionItemStructOutput;
  item: Marketplace.MarketplaceItemStructOutput;
}
export type AuctionCreatedEvent = TypedEvent<
  [
    Marketplace.AuctionItemStructOutput,
    Marketplace.MarketplaceItemStructOutput
  ],
  AuctionCreatedEventObject
>;

export type AuctionCreatedEventFilter = TypedEventFilter<AuctionCreatedEvent>;

export interface AuctionFinishedEventObject {
  auction: Marketplace.AuctionItemStructOutput;
  item: Marketplace.MarketplaceItemStructOutput;
}
export type AuctionFinishedEvent = TypedEvent<
  [
    Marketplace.AuctionItemStructOutput,
    Marketplace.MarketplaceItemStructOutput
  ],
  AuctionFinishedEventObject
>;

export type AuctionFinishedEventFilter = TypedEventFilter<AuctionFinishedEvent>;

export interface BidMadeEventObject {
  auction: Marketplace.AuctionItemStructOutput;
}
export type BidMadeEvent = TypedEvent<
  [Marketplace.AuctionItemStructOutput],
  BidMadeEventObject
>;

export type BidMadeEventFilter = TypedEventFilter<BidMadeEvent>;

export interface ItemBoughtEventObject {
  item: Marketplace.MarketplaceItemStructOutput;
  prevOwner: string;
}
export type ItemBoughtEvent = TypedEvent<
  [Marketplace.MarketplaceItemStructOutput, string],
  ItemBoughtEventObject
>;

export type ItemBoughtEventFilter = TypedEventFilter<ItemBoughtEvent>;

export interface ItemCreatedEventObject {
  item: Marketplace.MarketplaceItemStructOutput;
}
export type ItemCreatedEvent = TypedEvent<
  [Marketplace.MarketplaceItemStructOutput],
  ItemCreatedEventObject
>;

export type ItemCreatedEventFilter = TypedEventFilter<ItemCreatedEvent>;

export interface ItemListedEventObject {
  item: Marketplace.MarketplaceItemStructOutput;
}
export type ItemListedEvent = TypedEvent<
  [Marketplace.MarketplaceItemStructOutput],
  ItemListedEventObject
>;

export type ItemListedEventFilter = TypedEventFilter<ItemListedEvent>;

export interface ItemUnlistedEventObject {
  item: Marketplace.MarketplaceItemStructOutput;
}
export type ItemUnlistedEvent = TypedEvent<
  [Marketplace.MarketplaceItemStructOutput],
  ItemUnlistedEventObject
>;

export type ItemUnlistedEventFilter = TypedEventFilter<ItemUnlistedEvent>;

export interface Marketplace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarketplaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buyItem(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancel(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createItem(
      itemMetadataUri: string,
      price: BigNumberish,
      name: string,
      contractType: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    finishAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    listItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    listItemOnAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    makeBid(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  buyItem(
    itemId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancel(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelAuction(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createItem(
    itemMetadataUri: string,
    price: BigNumberish,
    name: string,
    contractType: BigNumberish,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  finishAuction(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  listItem(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  listItemOnAuction(
    itemId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  makeBid(
    itemId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onERC1155BatchReceived(
    arg0: string,
    arg1: string,
    arg2: BigNumberish[],
    arg3: BigNumberish[],
    arg4: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  onERC1155Received(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    arg3: BigNumberish,
    arg4: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    buyItem(itemId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    cancel(itemId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    cancelAuction(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    createItem(
      itemMetadataUri: string,
      price: BigNumberish,
      name: string,
      contractType: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    finishAuction(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    listItem(itemId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    listItemOnAuction(
      itemId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    makeBid(itemId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "AuctionCanceled(tuple,tuple)"(
      auction?: null,
      item?: null
    ): AuctionCanceledEventFilter;
    AuctionCanceled(auction?: null, item?: null): AuctionCanceledEventFilter;

    "AuctionCreated(tuple,tuple)"(
      auction?: null,
      item?: null
    ): AuctionCreatedEventFilter;
    AuctionCreated(auction?: null, item?: null): AuctionCreatedEventFilter;

    "AuctionFinished(tuple,tuple)"(
      auction?: null,
      item?: null
    ): AuctionFinishedEventFilter;
    AuctionFinished(auction?: null, item?: null): AuctionFinishedEventFilter;

    "BidMade(tuple)"(auction?: null): BidMadeEventFilter;
    BidMade(auction?: null): BidMadeEventFilter;

    "ItemBought(tuple,address)"(
      item?: null,
      prevOwner?: string | null
    ): ItemBoughtEventFilter;
    ItemBought(item?: null, prevOwner?: string | null): ItemBoughtEventFilter;

    "ItemCreated(tuple)"(item?: null): ItemCreatedEventFilter;
    ItemCreated(item?: null): ItemCreatedEventFilter;

    "ItemListed(tuple)"(item?: null): ItemListedEventFilter;
    ItemListed(item?: null): ItemListedEventFilter;

    "ItemUnlisted(tuple)"(item?: null): ItemUnlistedEventFilter;
    ItemUnlisted(item?: null): ItemUnlistedEventFilter;
  };

  estimateGas: {
    buyItem(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancel(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createItem(
      itemMetadataUri: string,
      price: BigNumberish,
      name: string,
      contractType: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    finishAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    listItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    listItemOnAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    makeBid(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyItem(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancel(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createItem(
      itemMetadataUri: string,
      price: BigNumberish,
      name: string,
      contractType: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    finishAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    listItem(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    listItemOnAuction(
      itemId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    makeBid(
      itemId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onERC1155BatchReceived(
      arg0: string,
      arg1: string,
      arg2: BigNumberish[],
      arg3: BigNumberish[],
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    onERC1155Received(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      arg3: BigNumberish,
      arg4: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
