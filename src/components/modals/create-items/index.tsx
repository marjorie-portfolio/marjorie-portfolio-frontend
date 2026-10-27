import { Button, Text, Box, Stack, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';

import ItemTypeSelection from '../create-items/ItemTypeSelection';

export default function CreateItemsModals() {

  const typeModal = () =>
    modals.open({
      title: (
        <Box style={{ textAlign: 'left', width: '100%' }}>
          <Text fw={900} size="lg" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            CREATE SECTION
          </Text>
          <Text size="xs" c="dimmed" fw={700}>
            Choose the section type
          </Text>
        </Box>
      ),
      centered: true,
      radius: 'lg',
      size: 'lg', padding: 'md',
      styles: {
        header: {
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '12px',
        },
      },
      children: <ItemTypeSelection />,
    });


  return { typeModal}
}