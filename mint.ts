import { Transaction, SystemProgram, Keypair, Connection, PublicKey } from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';
import { bundlrStorage, findMetadataPda, keypairIdentity, Metaplex, UploadMetadataInput } from '@metaplex-foundation/js';
import secret from './guideSecret.json';

const endpoint = ""; //add your RPC endpoint
const solanaConnection = new Connection(endpoint);

const MINT_CONFIG = {
    numDecimals: 6,
    numberTOkens: 1337
}

const MY_TOKEN_METADATA: UploadMetadataInput = {
    name: "Deepjyoti Token",
    symbol: "DST",
    description: "Solana test Token by Deepjyoti",
    image: "" //add public URL to image you'd like to use
}

const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name,
    symbol: MY_TOKEN_METADATA.symbol,
    uri: "TO_UPDATE_LATER",
    sellerFeeBasisPoints:0,
    creators:null,
    collection: null,
    uses: null
} as DataV2;

/**
 * 
 * @param wallet Solana Keypair
 * @param tokenMetadata Metaplex Fungible Token Standard object 
 * @returns Arweave url for our metadata json file
 */

const UploadMetadata = async(wallet: Keypair, tokenMetadata: UploadMetadataInput):Promise<string> => {
    //create metaplex instance on devnet using this wallet
    const metaplex = Metaplex.make(solanaConnection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: endpoint,
            timeout: 60000,
        }));

    //Upload to Arweave
    const {uri} = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
    
}