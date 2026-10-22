import { Button, Text, Box, Stack, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';

import ItemTypeSelection from './ItemTypeSelection';

export default function CreateSectionModals() {
const nameModal = () =>
    modals.open({
      title: (
        <Box style={{ textAlign: 'center', width: '100%' }}>
          <Text fw={900} size="lg" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            CREATE SECTION
          </Text>
          <Text size="xs" c="dimmed">
            Set name for the section
          </Text>
        </Box>
      ),
      centered: true,
      radius: 'lg',
      padding: 'md',
      styles: {
        header: {
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '12px',
        },
      },
      children: (
        <Stack gap="xl" mt="md">
          <TextInput
            label={
              <Text fw={800} size="xs" style={{ letterSpacing: '0.5px' }}>
                SECTION NAME:
              </Text>
            }
            placeholder="e.g About me, Skills, Journey"
            radius="xl"
            size="md"
            styles={{
              input: {
                backgroundColor: '#ffffff',
                fontWeight: 600,
                color: '#495057',
              },
            }}
          />

          <Button
            fullWidth
            radius="xl"
              
            size="md"
            color="pink"
            onClick={() => {
              modals.closeAll();
              typeModal();
            }}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 700,
            }}
          >
            CONTINUE
          </Button>
        </Stack>
      ),
    });

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


  return {nameModal, typeModal}
}