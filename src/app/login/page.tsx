import LoginForm from '@/components/login-form'
import { Flex, Stack } from '@mantine/core'
import Image from 'next/image'

export default function Login() {
  return (
    <Flex align="center" justify="center" className="w-full">
        <Stack className="w-3/4" justify="center" align="center">
            <div className="text-center mt-20">
                <Image src="/logo_otsan.png" alt="Hemmersbach"  width={214} height={77} />
            </div>

            <Stack justify="center" className="w-full" p="20" bg="var(--mantine-color-gray-light)">
                <h1 className="my-4">Please login...</h1>
                <LoginForm />
            </Stack>
        </Stack>

    </Flex>
  )
}
