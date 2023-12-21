import { Card, Group, Text, Image, Anchor } from '@mantine/core';
import { IconDots, IconEye, IconFileZip, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

export default function Start() {
    return (
        // <Card shadow="sm" padding="lg" radius="md" withBorder>
        //   <Card.Section>
        //     <Image
        //       src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
        //       height={160}
        //       alt="Norway"
        //     />
        //   </Card.Section>
    
        //   <Group justify="space-between" mt="md" mb="xs">
        //     <Text fw={500}>Norway Fjord Adventures</Text>
        //   </Group>
    
        //   <Text size="sm" c="dimmed">
        //     With Fjord Tours you can explore more of the magical fjord landscapes with tours and
        //     activities on and around the fjords of Norway
        //   </Text>
    
        // </Card>
        <div>
          <p>You are logged in as rs@orga.zone.</p>

          <p>Your last login was: 3rd of May, 2017.</p>
          
          <p>Last server contact: 2nd of May, 2017.</p>
          <Anchor component={Link} href="local">
            4 local sites available
          </Anchor>
          
          
        </div>
      );
}