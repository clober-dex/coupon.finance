type UserDto = {
  userAddress?: `0x${string}`
  balance?: string
}

export async function registerUser(address?: `0x${string}`, balance?: bigint) {
  await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + '/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userAddress: address,
      balance: balance?.toString(),
    }),
  })
}

export async function fetchUser(): Promise<{
  userAddress?: `0x${string}`
  balance?: bigint
}> {
  const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_URL + '/api/user')
  const data = (await response.json()) as UserDto
  return {
    userAddress: data.userAddress,
    balance: data.balance ? BigInt(data.balance) : undefined,
  }
}
