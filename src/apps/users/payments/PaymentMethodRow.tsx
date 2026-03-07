import {
    Flex,
    Box,
    Menu,
    Text,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { useSystemColor } from "~/hooks/use-system-color";
import { cardBrandLabel } from "~/hooks/usePaymentMethods";

export function PaymentMethodRow({
    brand,
    last4,
    expMonth,
    expYear,
    onSetDefault,
    onRemove,
    isRemoving,
    isSettingDefault,
}: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    onSetDefault?: () => void;
    onRemove?: () => void;
    isRemoving?: boolean;
    isSettingDefault?: boolean;
}) {
    const { headingColor, mutedTextColor, borderColor, linkColor } = useSystemColor();
    const exp = `${String(expMonth).padStart(2, "0")}/${expYear}`;
    return (
        <Flex
            align="center"
            justify="space-between"
            py={4}
            borderBottomWidth="1px"
            borderColor={borderColor}
            _last={{ borderBottomWidth: 0 }}
        >
            <Flex align="center" gap={4}>
                <Flex
                    align="center"
                    justify="center"
                    w="48px"
                    h="32px"
                    bg="blue.600"
                    color="white"
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="bold"
                >
                    {brand.toUpperCase()}
                </Flex>
                <Box>
                    <Text fontWeight="600" color={headingColor} fontSize="md">
                        {cardBrandLabel(brand)} •••• {last4}
                    </Text>
                    <Text fontSize="sm" color={mutedTextColor}>
                        Expiration: {exp}
                    </Text>
                </Box>
            </Flex>
            <Menu placement="bottom-end">
                <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    variant="outline"
                    size="sm"
                    icon={<FiMoreVertical />}
                    borderColor="blue.500"
                    borderRadius="md"
                    isDisabled={isRemoving || isSettingDefault}
                />
                <MenuList minW="140px" py={1}>
                    <MenuItem
                        onClick={onSetDefault}
                        textDecoration="underline"
                        color={linkColor}
                        fontSize="sm"
                        isDisabled={isSettingDefault}
                        closeOnSelect
                    >
                        {isSettingDefault ? "Setting default…" : "Set as default"}
                    </MenuItem>
                    <MenuItem
                        onClick={onRemove}
                        textDecoration="underline"
                        color={linkColor}
                        fontSize="sm"
                        isDisabled={isRemoving}
                        closeOnSelect
                    >
                        {isRemoving ? "Removing…" : "Remove"}
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}