import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

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

    if (response.data.success && response.data.score >= 0.5) {
      //INSERT API/LOGIC for saving data once the validation is complete
      const userAddress = req.body.address
      if (!userAddress) {
        return res.json({
          status: 'error',
          message: 'Something went wrong, please try again!!!',
        })
      }

      const provider = new ethers.providers.JsonRpcProvider(
        'https://goerli-rollup.arbitrum.io/rpc',
      )
      const wallet = new ethers.Wallet(
        process.env.DEV_PRIVATE_KEY as `0x${string}`,
        provider,
      )
      const faucetContract = new ethers.Contract(
        '0x7Eb217546baa755E3e8561B0460c88e250D97Ad7',
        FAUCET_ABI,
        provider,
      )
      const tx = await faucetContract.connect(wallet).faucetTokens(
        [
          '0xd513E4537510C75E24f941f159B7CAFA74E7B3B9', // USDC
          '0xe73C6dA65337ef99dBBc014C7858973Eba40a10b', // DAI
          '0x8dA9412AbB78db20d0B496573D9066C474eA21B8', // USDT
          '0x1377b75237a9ee83aC0C76dE258E68e875d96334', // WBTC
        ],
        [
          100000000000n, // 100000 USDC
          100000000000000000000000n, // 100000 DAI
          100000000000n, // 100000 USDT
          100000000n, // 1 WBTC
        ],
        userAddress,
        {
          value: ethers.utils.parseEther('0.01'),
        },
      )
      await tx.wait()
      return res.json({
        status: 'success',
        txHash: tx.hash,
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
