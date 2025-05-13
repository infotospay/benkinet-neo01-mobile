import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { switchUserRole, UserRole, UserRoleInfo } from '../../store/slices/roleSlice';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface RoleSwitcherProps {
  compact?: boolean;
  onRoleSwitch?: () => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ compact = false, onRoleSwitch }) => {
  const dispatch = useAppDispatch();
  const { availableRoles, activeRole, isLoading } = useAppSelector((state) => state.role);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleRoleSwitch = async (roleId: string) => {
    if (roleId === activeRole?.id) {
      setModalVisible(false);
      return;
    }
    
    try {
      await dispatch(switchUserRole(roleId)).unwrap();
      setModalVisible(false);
      if (onRoleSwitch) {
        onRoleSwitch();
      }
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.CUSTOMER:
        return '👤';
      case UserRole.MERCHANT:
        return '🏪';
      case UserRole.AGENT:
        return '🧑‍💼';
      case UserRole.SUPER_AGENT:
        return '👨‍💼';
      default:
        return '👤';
    }
  };
  
  const renderRoleItem = ({ item }: { item: UserRoleInfo }) => {
    const isActive = item.id === activeRole?.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.roleItem,
          isActive && styles.activeRoleItem,
        ]}
        onPress={() => handleRoleSwitch(item.id)}
        disabled={isLoading}
      >
        <View style={styles.roleIconContainer}>
          <Text style={styles.roleIcon}>{getRoleIcon(item.role)}</Text>
        </View>
        <View style={styles.roleInfo}>
          <Text style={[styles.roleName, isActive && styles.activeRoleName]}>
            {item.name}
          </Text>
          <Text style={styles.roleType}>
            {item.role.charAt(0) + item.role.slice(1).toLowerCase()}
          </Text>
        </View>
        {isActive && (
          <View style={styles.activeIndicator}>
            <Text style={styles.activeIndicatorText}>Active</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  if (!activeRole || availableRoles.length <= 1) {
    return null;
  }
  
  return (
    <>
      <TouchableOpacity
        style={[styles.switcherButton, compact && styles.compactSwitcherButton]}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <>
            <Text style={[styles.switcherButtonIcon, compact && styles.compactSwitcherButtonIcon]}>
              {getRoleIcon(activeRole.role)}
            </Text>
            {!compact && (
              <View style={styles.switcherButtonTextContainer}>
                <Text style={styles.switcherButtonText}>{activeRole.name}</Text>
                <Text style={styles.switcherButtonSubtext}>
                  {activeRole.role.charAt(0) + activeRole.role.slice(1).toLowerCase()}
                </Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Role</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableRoles}
              renderItem={renderRoleItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.rolesList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  switcherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  compactSwitcherButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  switcherButtonIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.sm,
  },
  compactSwitcherButtonIcon: {
    marginRight: 0,
  },
  switcherButtonTextContainer: {
    flexDirection: 'column',
  },
  switcherButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
  },
  switcherButtonSubtext: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  rolesList: {
    padding: spacing.md,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  activeRoleItem: {
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  roleIcon: {
    fontSize: typography.fontSize.lg,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  activeRoleName: {
    color: colors.primary,
  },
  roleType: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  activeIndicatorText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
});

export default RoleSwitcher;
