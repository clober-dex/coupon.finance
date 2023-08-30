import axios from 'axios'
import { createWalletClient, http, parseEther, publicActions } from 'viem'
import type { NextApiRequest, NextApiResponse } from 'next'
import { privateKeyToAccount } from 'viem/accounts'

import { couponFinanceChain } from '../../utils/dev-chain'

const FAUCET_ABI = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'faucetTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTHA_SECRET_KEY

  const verificationUrl =
    'https://www.google.com/recaptcha/api/siteverify?secret=' +
    secretKey +
    '&response=' +
    token

  const result = await axios.post(verificationUrl)
  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const token = req.body.gRecaptchaToken

    // Recaptcha response
    const response = await verifyRecaptcha(token)

    // Checking if the reponse sent by reCaptcha success or not and if the score is above 0.5
    // In ReCaptcha v3, a score sent which tells if the data sent from front end is from Human or from Bots. If score above 0.5 then it is human otherwise it is bot
    // For more info check, https://developers.google.com/recaptcha/docs/v3
    // ReCaptcha v3 response, {
    //     "success": true|false,      // whether this request was a valid reCAPTCHA token for your site
    //     "score": number             // the score for this request (0.0 - 1.0)
    //     "action": string            // the action name for this request (important to verify)
    //     "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    //     "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
    //     "error-codes": [...]        // optional
    //   }
    if (response.data.success && response.data.score >= 0.5) {
      //INSERT API/LOGIC for saving data once the validation is complete
      const userAddress = req.body.address
      if (!userAddress) {
        return res.json({
          status: 'error',
          message: 'Something went wrong, please try again!!!',
        })
      }
      const account = privateKeyToAccount(
        process.env.DEV_PRIVATE_KEY as `0x${string}`,
      )
      const client = createWalletClient({
        account,
        chain: couponFinanceChain,
        transport: http(),
      }).extend(publicActions)
      const { request } = await client.simulateContract({
        address: '0xE1B33C4099C37A48d70599BB39a48870c7eaDC81', // Faucet address
        abi: FAUCET_ABI,
        functionName: 'faucetTokens',
        args: [
          [
            '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
            '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
            '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
            '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
            '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // WBTC
          ],
          [
            100000000000000000n, // 0.1 WETH
            100000000n, // 100 USDC
            100000000000000000000n, // 100 DAI
            100000000n, // 100 USDT
            10000000n, // 0.1 WBTC
          ],
          userAddress,
        ],
        account: account.address,
        value: parseEther('0.1'),
        gas: 1000000n,
      })
      const hash = await client.writeContract(request)

      return res.json({
        status: 'success',
        txHash: hash,
      })
    } else {
      return res.json({
        status: 'error',
        message: 'Something went wrong, please try again!!!',
      })
    }
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Something went wrong, please try again!!!',
    })
  }
}
