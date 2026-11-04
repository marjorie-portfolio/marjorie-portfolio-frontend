import { Text, Button, Group, Stack, Box, UnstyledButton } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';


export default function ItemTypeSelection() {
  const [selectedType, setSelectedType] = useState<string>('');

  const {colors} = useTheme()

  return (
    <Stack gap="xl" >
      <Group justify="center" align="flex-start" gap="md">
        {/* Option 1: Image with title and description */}
        <UnstyledButton
          onClick={() => setSelectedType('type_3')}
          style={{ textAlign: 'center' }}
        >
          <Box
            p="md"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: selectedType === 'type_3' ? '2px solid #d87d8a' : '1px solid #e0e0e0',
              width: '140px',
              height: '110px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '6px',
            }}
          >
            <Box style={{ width: '80%', height: '40px', backgroundColor: '#d87d8a', borderRadius: '2px' }} />
            <Box style={{ width: '40%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
            <Box style={{ width: '70%', height: '18px', backgroundColor: '#d87d8a', borderRadius: '2px' }} />
          </Box>
          <Text size="10px" fw={800} mt={6} style={{ textTransform: 'uppercase' }}>
            • IMAGE WITH TITLE AND DESCRIPTION
          </Text>
        </UnstyledButton>

        {/* Option 2: Image with title */}
        <UnstyledButton
          onClick={() => setSelectedType('type_2')}
          style={{ textAlign: 'center' }}
        >
          <Box
            p="md"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: selectedType === 'type_2' ? '2px solid #d87d8a' : '1px solid #e0e0e0',
              width: '140px',
              height: '110px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
            }}
          >
            <Box style={{ width: '80%', height: '45px', backgroundColor: '#d87d8a', borderRadius: '2px' }} />
            <Box style={{ width: '60%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
          </Box>
          <Text size="10px" fw={800} mt={6} style={{ textTransform: 'uppercase' }}>
            • IMAGE WITH TITLE
          </Text>
        </UnstyledButton>
      </Group>

      {/* Option 3: Text only (centered below) */}
      <Group justify="center">
        <UnstyledButton
          onClick={() => setSelectedType('type_1')}
          style={{ textAlign: 'center' }}
        >
          <Box
            p="md"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: selectedType === 'type_1' ? '2px solid #d87d8a' : '1px solid #e0e0e0',
              width: '150px',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              gap: '6px',
            }}
          >
            <Box style={{ width: '50%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
            <Box style={{ width: '80%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
            <Box style={{ width: '80%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
            <Box style={{ width: '80%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
            <Box style={{ width: '80%', height: '6px', backgroundColor: '#d87d8a', borderRadius: '1px' }} />
          </Box>
          <Text size="10px" fw={800} mt={6} style={{ textTransform: 'uppercase' }}>
            • TITLE AND DESCRIPTION
          </Text>
        </UnstyledButton>
      </Group>

      {/* Action Buttons */}
      <Group justify="center" gap="md" >
        <Button
          variant="outline"
          color="pink"
          radius="xl"
          size="xs"
          style={{
             width: 180,
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
          onClick={() => modals.closeAll()}
        >
          CONTINUE
        </Button>

        <Button
          color="pink"
          radius="xl"
          size="xs"
          style={{
            width: 180,
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
          onClick={() => {
            console.log('Selected item type:', selectedType);
            modals.closeAll();
          }}
        >
          NEXT
        </Button>
      </Group>
    </Stack>
  );
}

