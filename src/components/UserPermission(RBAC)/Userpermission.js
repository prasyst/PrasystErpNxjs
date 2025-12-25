// app/userpermission/page.js
'use client';

import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Button,
  Typography,
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
  InputLabel,
  DialogContent,
  Alert,
  DialogActions,
  DialogTitle,
  Dialog
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from '@/lib/axios';
import { sidebarMenuItems } from "../dashboard/SidebarMenu";

const UserPermission = () => {
  const [menus, setMenus] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [sourceUserId, setSourceUserId] = useState(null);
  const [targetUserId, setTargetUserId] = useState(null);
  const [isCopying, setIsCopying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Map MOD_NAME to sidebar menu items
  const mapModuleToSidebar = (moduleName, moduleDesc) => {
    const findInSidebar = (items) => {
      for (const item of items) {
        if (!item) continue;
        
        if (
          item.path && 
          (item.path.includes(moduleName.toLowerCase().replace('mnu', '')) ||
          item.name.toLowerCase().includes(moduleDesc.toLowerCase()))
        ) {
          return item;
        }
        
        if (item.children) {
          const foundChild = findInSidebar(item.children);
          if (foundChild) return foundChild;
        }
      }
      return null;
    };
    
    const matchedItem = findInSidebar(sidebarMenuItems);
    
    if (matchedItem) {
      return {
        name: matchedItem.name,
        icon: matchedItem.icon,
        path: matchedItem.path
      };
    }
    
    return {
      name: moduleDesc || moduleName.replace('mnu', '').replace(/([A-Z])/g, ' $1').trim(),
      icon: null,
      path: '#'
    };
  };

  // Fetch modules from API
  const fetchModules = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.post(
        '/MODULE/GetMODULESDashBoard?currentPage=1&limit=100',
        {
          PageNumber: 1,
          PageSize: 100,
          SearchText: ""
        }
      );
      
      console.log('Modules API Response:', response.data);
      
      if (response.data && response.data.DATA) {
        const tree = buildTree(response.data.DATA);
        setMenus(tree);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure from flat modules array
  const buildTree = (data) => {
    const idToNodeMap = {};
    const rootNodes = [];

    data.forEach((item) => {
      const node = {
        ...item,
        ModuleId: item.MOD_ID,
        ModuleName: item.MOD_DESC?.trim() || item.MOD_NAME,
        ParentId: item.PARENT_ID,
        Level: 0,
        children: [],
        expanded: false,
        checked: false,
        permissions: {
          Add: false,
          View: false,
          Edit: false,
          Delete: false
        },
        originalName: item.MOD_NAME,
        originalDesc: item.MOD_DESC
      };
      idToNodeMap[item.MOD_ID] = node;
    });

    data.forEach((item) => {
      const node = idToNodeMap[item.MOD_ID];
      
      if (item.PARENT_ID === null || item.PARENT_ID === 0 || item.PARENT_ID === "0") {
        node.Level = 0;
        rootNodes.push(node);
      } else if (idToNodeMap[item.PARENT_ID]) {
        let level = 1;
        let parent = idToNodeMap[item.PARENT_ID];
        while (parent && parent.ParentId && parent.ParentId !== null && parent.ParentId !== 0 && parent.ParentId !== "0") {
          level++;
          parent = idToNodeMap[parent.ParentId];
        }
        node.Level = level;
        idToNodeMap[item.PARENT_ID].children.push(node);
      } else {
        node.Level = 0;
        rootNodes.push(node);
      }
    });

    const sortNodes = (nodes) => {
      return nodes.sort((a, b) => {
        return (a.ModuleName || '').localeCompare(b.ModuleName || '');
      }).map(node => {
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: sortNodes(node.children)
          };
        }
        return node;
      });
    };

    return sortNodes(rootNodes);
  };
  
  // Fetch users from NEW API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/USERS/GetUserLoginDrp', {
        "FLAG": "User"
      });

      console.log('Users API Response:', response.data);

      if (response.data && response.data.DATA && response.data.DATA.length > 0) {
        const users = response.data.DATA.map(user => ({
          Id: user.USER_ID,
          Name: user.USER_NAME
        }));
        
        setUsersList(users);
        
        // Auto-select the first user
        const firstUser = users[1];
        setSelectedRoleId(firstUser.Id);
        setSelectedRole(firstUser.Name);
        setSelectedUsers([firstUser.Id]);
        
        // Fetch modules after selecting first user
        await fetchModules();
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async (userId) => {
    try {
      const permissions = await axiosInstance.post(userId);
      if (permissions.length > 0) {
        const updatedTree = updateTreeWithPermissions(menus, permissions);
        setMenus(updatedTree);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Update tree with permissions
  const updateTreeWithPermissions = (tree, permissions) => {
    const updateNode = (nodes) => {
      return nodes.map(node => {
        const savedPermission = permissions.find(p => 
          p.ModuleId === node.ModuleId ||
          p.ModuleId === node.ModuleId.toString()
        );

        if (savedPermission) {
          return {
            ...node,
            checked: true,
            expanded: node.Level === 0 ? false : false,
            permissions: {
              Add: savedPermission.AddRec === 1 || savedPermission.AddRec === "1",
              View: savedPermission.ViewRec === 1 || savedPermission.ViewRec === "1",
              Edit: savedPermission.EditRec === 1 || savedPermission.EditRec === "1",
              Delete: savedPermission.DeleteRec === 1 || savedPermission.DeleteRec === "1"
            },
            children: node.children ? updateNode(node.children) : []
          };
        }

        return {
          ...node,
          children: node.children ? updateNode(node.children) : []
        };
      });
    };
    return updateNode(tree);
  };

  // Handle copy permissions
  const handleCopyPermissions = async () => {
    if (!sourceUserId || !targetUserId) {
      toast.error("Please select both source and target users");
      return;
    }

    if (sourceUserId === targetUserId) {
      toast.warning("Source and target users cannot be the same");
      return;
    }

    setIsCopying(true);
    try {
      await axiosInstance.post(sourceUserId, targetUserId);
      toast.success("Permissions copied successfully!");
      setCopyDialogOpen(false);
      
      if (targetUserId === selectedRoleId) {
        await fetchUserPermissions(targetUserId);
      }
    } catch (error) {
      toast.error("Failed to copy permissions");
    } finally {
      setIsCopying(false);
    }
  };

  // Handle permission change
  const handlePermissionChange = (moduleId, permissionType, checked) => {
    setMenus((prevMenus) => {
      const findNodeAndPath = (nodes, targetId, path = []) => {
        for (const node of nodes) {
          if (node.ModuleId === targetId) {
            return { node, path };
          }
          if (node.children) {
            const result = findNodeAndPath(node.children, targetId, [...path, node]);
            if (result.node) return result;
          }
        }
        return { node: null, path: [] };
      };

      let newMenus = [...prevMenus];
      const { node: targetNode, path } = findNodeAndPath(newMenus, moduleId);

      if (targetNode) {
        targetNode.permissions[permissionType] = checked;
        const hasAnyPermission = Object.values(targetNode.permissions).some(val => val);
        targetNode.checked = hasAnyPermission;

        path.forEach(parentNode => {
          parentNode.checked = true;
          parentNode.permissions[permissionType] = true;
        });
      }

      return newMenus;
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (node, checked) => {
    setMenus((prevMenus) => {
      const updateChildren = (n, isChecked) => {
        return {
          ...n,
          checked: isChecked,
          expanded: n.expanded,
          permissions: {
            Add: isChecked,
            View: isChecked,
            Edit: isChecked,
            Delete: isChecked
          },
          children: n.children ? n.children.map(child => updateChildren(child, isChecked)) : []
        };
      };

      const findNodeAndUpdate = (nodes) => {
        return nodes.map(n => {
          if (n.ModuleId === node.ModuleId) {
            return updateChildren(n, checked);
          }
          if (n.children) {
            return { ...n, children: findNodeAndUpdate(n.children) };
          }
          return n;
        });
      };

      return findNodeAndUpdate(prevMenus);
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    const getPermissions = (nodes) => {
      let permissions = [];
      nodes.forEach((node) => {
        if (node.checked) {
          permissions.push({
            UserPrevId: 0,
            UserId: parseInt(selectedRoleId, 10),
            ModuleId: node.ModuleId,
            AllRec: 1,
            AddRec: node.permissions.Add ? 1 : 0,
            EditRec: node.permissions.Edit ? 1 : 0,
            DeleteRec: node.permissions.Delete ? 1 : 0,
            ReportRec: 1,
            ViewRec: node.permissions.View ? 1 : 0,
            Status: "1"
          });
        }

        if (node.children) {
          permissions = [...permissions, ...getPermissions(node.children)];
        }
      });
      return permissions;
    };

    const permissionsPayload = getPermissions(menus);

    if (permissionsPayload.length === 0) {
      toast.warning("No permissions selected for submission.");
      return;
    }

    try {
      await axiosInstance.post(permissionsPayload);
      toast.success("Permissions submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit permissions");
    }
  };

  // Render permission buttons
  const renderPermissionButtons = (node) => {
    if (!node.children || node.children.length === 0) {
      return (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          ml: 1,
          borderLeft: "1px solid #e0e0e0",
          paddingLeft: 1,
          height: "24px",
          gap: 0.25
        }}>
          {["Add", "View", "Edit", "Delete"].map((permission) => (
            <Box
              key={permission}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: node.permissions[permission] ? "#e3f2fd" : "#f5f5f5",
                borderRadius: 0.5,
                width: "68px",
                height: "22px",
              }}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                pl: 0.5
              }}>
                <Checkbox
                  size="small"
                  checked={node.permissions[permission]}
                  onChange={(e) => handlePermissionChange(node.ModuleId, permission, e.target.checked)}
                  sx={{
                    padding: "2px",
                    '& .MuiSvgIcon-root': { fontSize: 16 }
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.7rem",
                    color: node.permissions[permission] ? "#1976d2" : "text.secondary",
                    ml: 0.25
                  }}
                >
                  {permission}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Render tree with compact design
  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <Box
        key={node.ModuleId}
        sx={{
          pl: node.Level * 2,
          mt: 0,
          borderLeft: node.Level > 0 ? "1px dashed #ddd" : "none",
          padding: '0px',
          '&:first-of-type': { mt: 0 }
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "28px",
            maxHeight: "28px",
            backgroundColor: node.checked ? "rgba(25, 118, 210, 0.04)" : "transparent",
            borderRadius: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            }
          }}
        >
          {node.children && node.children.length > 0 ? (
            <IconButton
              onClick={() => {
                setMenus((prevMenus) => {
                  const updateExpanded = (nodes) => {
                    return nodes.map((n) => {
                      if (n.ModuleId === node.ModuleId) {
                        return { ...n, expanded: !n.expanded };
                      }
                      if (n.children) {
                        return { ...n, children: updateExpanded(n.children) };
                      }
                      return n;
                    });
                  };
                  return updateExpanded(prevMenus);
                });
              }}
              sx={{
                p: 0.25,
                mr: 0.25,
                "& svg": { fontSize: "0.9rem" }
              }}
            >
              {node.expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          ) : (
            <Box sx={{ width: 32 }}></Box>
          )}

          <Checkbox
            size="small"
            checked={node.checked}
            onChange={(e) => handleCheckboxChange(node, e.target.checked)}
            sx={{
              mr: 0.5,
              padding: "2px",
              '& .MuiSvgIcon-root': { fontSize: 18 }
            }}
          />

          <Tooltip title={node.ModuleName} arrow>
            <Typography
              variant="body2"
              sx={{
                fontWeight: node.Level === 0 ? 600 : (node.Level === 1 ? 500 : 400),
                fontSize: node.Level === 0 ? "0.8rem" : "0.75rem",
                color: node.Level === 0 ? "#1976d2" : (node.Level === 1 ? "text.primary" : "text.secondary"),
                minWidth: "180px",
                maxWidth: "220px",
                flexShrink: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {node.ModuleName}
            </Typography>
          </Tooltip>

          {renderPermissionButtons(node)}
        </Box>

        {node.children && node.children.length > 0 && (
          <Collapse in={node.expanded} timeout="auto" unmountOnExit>
            <Box sx={{ ml: 0.5, mt: 0 }}>
              {renderTree(node.children)}
            </Box>
          </Collapse>
        )}
      </Box>
    ));
  };

  // Initialize - Only fetch users on mount
  useEffect(() => {
    fetchUsers(); // This will auto-select first user and call fetchModules
  }, []);

  // Fetch permissions when user changes
  useEffect(() => {
    if (selectedRoleId && menus.length > 0) {
      fetchUserPermissions(selectedRoleId);
    }
  }, [selectedRoleId, menus.length]);

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: "#F5F5F5", 
      minHeight: "70vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      <ToastContainer />

      {/* Copy Permissions Dialog */}
      <Dialog 
        open={copyDialogOpen} 
        onClose={() => setCopyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContentCopyIcon />
            Copy Permissions
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Copy permissions from one user to another
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth variant="filled" className="custom-select" sx={{ height: '42px', mb: 2 }}>
                <InputLabel>Copy From (Source User)</InputLabel>
                <Select
                  value={sourceUserId || ''}
                  onChange={(e) => setSourceUserId(e.target.value)}
                  label="Copy From (Source User)"
                >
                  {usersList.map((user) => (
                    <MenuItem key={user.Id} value={user.Id}>
                      {user.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <SwapHorizIcon sx={{ color: 'action.active', fontSize: 40 }} />
              </Box>

              <FormControl fullWidth variant="filled" className="custom-select" sx={{ height: '42px' }}>
                <InputLabel>Copy To (Target User)</InputLabel>
                <Select
                  value={targetUserId || ''}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  label="Copy To (Target User)"
                >
                  {usersList.map((user) => (
                    <MenuItem key={user.Id} value={user.Id}>
                      {user.Name} 
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="warning" sx={{ mt: 2 }}>
                This will overwrite all existing permissions for the target user.
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCopyDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleCopyPermissions} 
            color="primary" 
            variant="contained"
            disabled={!sourceUserId || !targetUserId || isCopying}
            startIcon={<ContentCopyIcon />}
          >
            {isCopying ? "Copying..." : "Copy Permissions"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{
        backgroundColor: "#fff",
        borderRadius: 1,
        boxShadow: 1,
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <Box sx={{
          width: "100%",
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              color: "#333",
              fontSize: "1rem"
            }}>
              Please Select User for Permissions
            </Typography>

            <Tooltip title="Copy permissions to another user">
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => setCopyDialogOpen(true)}
                sx={{ ml: 2 }}
                disabled={!selectedRoleId}
                size="small"
              >
                Copy Permissions
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{
            width: "42.7%",
            marginRight: "auto",
            mb: 2
          }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedRoleId || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedUser = usersList.find(user => user.Id === selectedId);
                  setSelectedRoleId(selectedId);
                  setSelectedRole(selectedUser?.Name || "");
                  setSelectedUsers([selectedId]);
                }}
                label="Select User"
                disabled={loading || usersList.length === 0}
              >
                {loading ? (
                  <MenuItem disabled value="">
                    Loading users...
                  </MenuItem>
                ) : usersList.length === 0 ? (
                  <MenuItem disabled value="">
                    No users available
                  </MenuItem>
                ) : (
                  usersList.map((user) => (
                    <MenuItem key={user.Id} value={user.Id}>
                      {user.Name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {selectedRoleId && (
          <>
            <Box sx={{ 
              flex: 1,
              overflow: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              p: 1,
              maxHeight: "calc(83vh - 180px)"
            }}>
              {loading ? (
                <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                  Loading modules...
                </Typography>
              ) : menus.length > 0 ? (
                <Box sx={{ 
                  maxHeight: "100%",
                  '& > div': { mb: 0 }
                }}>
                  {renderTree(menus)}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                  No modules found
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              pt: 2,
              borderTop: "1px solid #e0e0e0"
            }}>
              <Button
                onClick={handleSubmit}
                sx={{
                  background: "#1976D2",
                  textTransform: "none",
                  color: "white",
                  "&:hover": { background: "#1565C0" },
                  px: 3,
                  py: 0.5,
                  fontSize: "0.875rem"
                }}
              >
                Submit
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserPermission;