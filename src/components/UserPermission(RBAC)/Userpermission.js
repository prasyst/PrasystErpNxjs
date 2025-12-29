
// // app/userpermission/page.js
// 'use client';

// import React, { useState, useEffect } from "react";
// import {
//   Checkbox,
//   Button,
//   Typography,
//   Box,
//   Collapse,
//   IconButton,
//   MenuItem,
//   Select,
//   FormControl,
//   Tooltip,
//   InputLabel,
//   DialogContent,
//   Alert,
//   DialogActions,
//   DialogTitle,
//   Dialog,
//   CircularProgress
// } from "@mui/material";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from '@/lib/axios';

// const UserPermission = () => {
//   const [menus, setMenus] = useState([]);
//   const [originalMenus, setOriginalMenus] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [usersList, setUsersList] = useState([]);
//   const [selectedRole, setSelectedRole] = useState("");
//   const [selectedRoleId, setSelectedRoleId] = useState(null);
//   const [selectedUserName, setSelectedUserName] = useState("");
//   const [copyDialogOpen, setCopyDialogOpen] = useState(false);
//   const [sourceUserId, setSourceUserId] = useState(null);
//   const [sourceUserName, setSourceUserName] = useState("");
//   const [targetUserId, setTargetUserId] = useState(null);
//   const [targetUserName, setTargetUserName] = useState("");
//   const [isCopying, setIsCopying] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [permissionsLoading, setPermissionsLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false); // New state for submit loading

//   // Build tree structure from flat modules array
//   const buildTree = (data) => {
//     const idToNodeMap = {};
//     const rootNodes = [];

//     // First pass: Create all nodes
//     data.forEach((item) => {
//       const node = {
//         ...item,
//         ModuleId: item.MOD_ID,
//         ModuleName: item.MOD_DESC?.trim() || item.MOD_NAME?.replace('mnu', '').replace(/([A-Z])/g, ' $1').trim() || `Module ${item.MOD_ID}`,
//         ParentId: item.PARENT_ID,
//         Level: 0,
//         children: [],
//         expanded: false,
//         checked: false,
//         originalPermissions: {
//           Add: item.ADD_PRIV === "1",
//           View: item.SELECT_PRIV === "1",
//           Edit: item.EDIT_PRIV === "1",
//           Delete: item.DELETE_PRIV === "1"
//         },
//         permissions: {
//           Add: item.ADD_PRIV === "1",
//           View: item.SELECT_PRIV === "1",
//           Edit: item.EDIT_PRIV === "1",
//           Delete: item.DELETE_PRIV === "1"
//         }
//       };
      
//       // Check if any permission is true for this node
//       const hasAnyPermission = node.permissions.Add || node.permissions.View || 
//                                node.permissions.Edit || node.permissions.Delete;
//       node.checked = hasAnyPermission;
      
//       idToNodeMap[item.MOD_ID] = node;
//     });

//     // Second pass: Build hierarchy
//     data.forEach((item) => {
//       const node = idToNodeMap[item.MOD_ID];
      
//       if (item.PARENT_ID === null || item.PARENT_ID === 0 || item.PARENT_ID === "0") {
//         node.Level = 0;
//         rootNodes.push(node);
//       } else if (idToNodeMap[item.PARENT_ID]) {
//         let level = 1;
//         let parent = idToNodeMap[item.PARENT_ID];
//         while (parent && parent.ParentId && parent.ParentId !== null && parent.ParentId !== 0 && parent.ParentId !== "0") {
//           level++;
//           parent = idToNodeMap[parent.ParentId];
//         }
//         node.Level = level;
//         idToNodeMap[item.PARENT_ID].children.push(node);
//       } else {
//         node.Level = 0;
//         rootNodes.push(node);
//       }
//     });

//     // Third pass: Update parent checked status based on children
//     const updateParentStatus = (node) => {
//       if (node.children && node.children.length > 0) {
//         let childChecked = false;
        
//         node.children.forEach(child => {
//           updateParentStatus(child);
//           if (child.checked) {
//             childChecked = true;
//           }
//         });
        
//         // Parent should be checked if ANY child is checked
//         if (childChecked) {
//           node.checked = true;
//         }
//       }
//     };

//     rootNodes.forEach(node => updateParentStatus(node));

//     // Sort nodes alphabetically
//     const sortNodes = (nodes) => {
//       return nodes.sort((a, b) => {
//         return (a.ModuleName || '').localeCompare(b.ModuleName || '');
//       }).map(node => {
//         if (node.children && node.children.length > 0) {
//           return {
//             ...node,
//             children: sortNodes(node.children)
//           };
//         }
//         return node;
//       });
//     };

//     return sortNodes(rootNodes);
//   };

//   // Fetch users from API
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.post('/USERS/GetUserLoginDrp', {
//         "FLAG": "User"
//       });

//       console.log('Users API Response:', response.data);

//       if (response.data && response.data.DATA && response.data.DATA.length > 0) {
//         const users = response.data.DATA.map(user => ({
//           Id: user.USER_ID,
//           Name: user.USER_NAME
//         }));
        
//         setUsersList(users);
        
//         // Auto-select the first user (index 1 as in your original code)
//         const firstUser = users[1] || users[0];
//         if (firstUser) {
//           setSelectedRoleId(firstUser.Id);
//           setSelectedUserName(firstUser.Name);
//           setSelectedRole(firstUser.Name);
//           setSelectedUsers([firstUser.Id]);
          
//           // Fetch permissions for first user
//           await fetchUserPermissions(firstUser.Name);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user permissions
//   const fetchUserPermissions = async (userName) => {
//     if (!userName) {
//       toast.error("Please select a user first");
//       return;
//     }
    
//     try {
//       setPermissionsLoading(true);
//       const response = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
//         "FLAG": "R",
//         "TBLNAME": "USERPRIVS",
//         "FLDNAME": "User_Id",
//         "ID": userName,
//         "ORDERBYFLD": "",
//         "CWHAER": "",
//         "CO_ID": ""
//       });
      
//       console.log('Permissions API Response:', response.data);
      
//       if (response.data && response.data.DATA && response.data.DATA.length > 0) {
//         // Build tree from permissions data
//         const tree = buildTree(response.data.DATA);
//         setMenus(tree);
//         setOriginalMenus(JSON.parse(JSON.stringify(tree))); // Deep copy for comparison
//       } else {
//         toast.warning("No permissions found for this user");
//         setMenus([]);
//         setOriginalMenus([]);
//       }
//     } catch (error) {
//       console.error('Error fetching permissions:', error);
//       toast.error('Failed to load permissions');
//       setMenus([]);
//       setOriginalMenus([]);
//     } finally {
//       setPermissionsLoading(false);
//     }
//   };

//   // Helper function to update parent status
//   const updateParentStatus = (nodes, updatedNodeId) => {
//     return nodes.map(node => {
//       if (node.children && node.children.length > 0) {
//         const updatedChildren = updateParentStatus(node.children, updatedNodeId);
        
//         // Check if any child is checked
//         let anyChildChecked = false;
//         updatedChildren.forEach(child => {
//           if (child.checked) {
//             anyChildChecked = true;
//           }
//         });
        
//         return {
//           ...node,
//           checked: anyChildChecked || node.checked,
//           children: updatedChildren
//         };
//       }
//       return node;
//     });
//   };

//   // Handle permission change
//   const handlePermissionChange = (moduleId, permissionType, checked) => {
//     setMenus((prevMenus) => {
//       const findNodeAndParents = (nodes, targetId, parents = []) => {
//         for (const node of nodes) {
//           if (node.ModuleId === targetId) {
//             return { node, parents };
//           }
//           if (node.children) {
//             const result = findNodeAndParents(node.children, targetId, [...parents, node]);
//             if (result.node) return result;
//           }
//         }
//         return { node: null, parents: [] };
//       };

//       const { node: targetNode, parents } = findNodeAndParents(prevMenus, moduleId);

//       if (targetNode) {
//         // Update the specific permission
//         const updatedNode = {
//           ...targetNode,
//           permissions: {
//             ...targetNode.permissions,
//             [permissionType]: checked
//           }
//         };
        
//         // Check if any permission is true
//         const hasAnyPermission = Object.values(updatedNode.permissions).some(val => val);
//         updatedNode.checked = hasAnyPermission;

//         // Update the node in the tree
//         const updateTree = (nodes) => {
//           return nodes.map(n => {
//             if (n.ModuleId === moduleId) {
//               return updatedNode;
//             }
//             if (n.children) {
//               return { ...n, children: updateTree(n.children) };
//             }
//             return n;
//           });
//         };

//         let newTree = updateTree(prevMenus);
        
//         // Update parent status
//         newTree = updateParentStatus(newTree, moduleId);
        
//         return newTree;
//       }

//       return prevMenus;
//     });
//   };

//   // Handle checkbox change (select all permissions)
//   const handleCheckboxChange = (node, checked) => {
//     setMenus((prevMenus) => {
//       const updateNodeAndChildren = (n, isChecked) => {
//         return {
//           ...n,
//           checked: isChecked,
//           expanded: n.expanded,
//           permissions: {
//             Add: isChecked,
//             View: isChecked,
//             Edit: isChecked,
//             Delete: isChecked
//           },
//           children: n.children ? n.children.map(child => updateNodeAndChildren(child, isChecked)) : []
//         };
//       };

//       const findNodeAndUpdate = (nodes) => {
//         return nodes.map(n => {
//           if (n.ModuleId === node.ModuleId) {
//             return updateNodeAndChildren(n, checked);
//           }
//           if (n.children) {
//             return { ...n, children: findNodeAndUpdate(n.children) };
//           }
//           return n;
//         });
//       };

//       let newTree = findNodeAndUpdate(prevMenus);
      
//       // Update parent status
//       newTree = updateParentStatus(newTree, node.ModuleId);
      
//       return newTree;
//     });
//   };

//   // Helper function to compare if two permission objects are equal
//   const arePermissionsEqual = (perm1, perm2) => {
//     return perm1.Add === perm2.Add &&
//            perm1.View === perm2.View &&
//            perm1.Edit === perm2.Edit &&
//            perm1.Delete === perm2.Delete;
//   };

//   // Collect only changed permissions for submission
//   const collectChangedPermissions = () => {
//     let permissions = [];
    
//     const findNodeInOriginal = (nodes, moduleId) => {
//       for (const node of nodes) {
//         if (node.ModuleId === moduleId) {
//           return node;
//         }
//         if (node.children) {
//           const found = findNodeInOriginal(node.children, moduleId);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
    
//     const traverse = (node) => {
//       const originalNode = findNodeInOriginal(originalMenus, node.ModuleId);
      
//       if (originalNode) {
//         // Check if permissions have changed
//         const permissionsChanged = !arePermissionsEqual(node.permissions, originalNode.permissions);
        
//         if (permissionsChanged) {
//           permissions.push({
//             "User_Name": selectedUserName,
//             "Mod_ID": node.ModuleId,
//             "ADD_PRIV": node.permissions.Add ? "1" : "0",
//             "EDIT_PRIV": node.permissions.Edit ? "1" : "0",
//             "DELETE_PRIV": node.permissions.Delete ? "1" : "0",
//             "SELECT_PRIV": node.permissions.View ? "1" : "0",
//             "REPORT_PRIV": "0",
//             "ALL_PRIV": "0"
//           });
//         }
//       } else {
//         // Node doesn't exist in original (shouldn't happen, but just in case)
//         if (node.checked) {
//           permissions.push({
//             "User_Name": selectedUserName,
//             "Mod_ID": node.ModuleId,
//             "ADD_PRIV": node.permissions.Add ? "1" : "0",
//             "EDIT_PRIV": node.permissions.Edit ? "1" : "0",
//             "DELETE_PRIV": node.permissions.Delete ? "1" : "0",
//             "SELECT_PRIV": node.permissions.View ? "1" : "0",
//             "REPORT_PRIV": "0",
//             "ALL_PRIV": "0"
//           });
//         }
//       }
      
//       if (node.children) {
//         node.children.forEach(traverse);
//       }
//     };
    
//     menus.forEach(traverse);
//     return permissions;
//   };

//   // Handle submit
 
// const handleSubmit = async () => {
//   if (!selectedUserName) {
//     toast.error("Please select a user first");
//     return;
//   }

//   const permissionsPayload = collectChangedPermissions();

//   if (permissionsPayload.length === 0) {
//     toast.warning("No changes detected for submission.");
//     return;
//   }

//   try {
//     setSubmitLoading(true);
//     console.log("Submitting changed permissions:", permissionsPayload);
    
//     const response = await axiosInstance.post('/MODULE/UpsertUserPrivs', permissionsPayload);
    
//     console.log("Submit response:", response.data);
    
//     // Check for success - either STATUS === "SUCCESS" or STATUS === 0 with success message
//     if ((response.data && response.data.STATUS === "SUCCESS") || 
//         (response.data && response.data.STATUS === 0 && response.data.MESSAGE && response.data.MESSAGE.includes("Success"))) {
//       toast.success(response.data.MESSAGE || "Permissions submitted successfully!");
      
//       // Update original menus to current state
//       setOriginalMenus(JSON.parse(JSON.stringify(menus)));
      
//       // Force a refresh by clearing and reloading permissions
//       setMenus([]); // Clear current menus
//       await fetchUserPermissions(selectedUserName); // Reload from server
      
//     } else {
//       // If STATUS is not SUCCESS, show error message from response if available
//       const errorMessage = response.data?.MESSAGE || "Failed to submit permissions";
//       toast.error(errorMessage);
//     }
//   } catch (error) {
//     console.error('Error submitting permissions:', error);
    
//     // Show more detailed error message
//     let errorMessage = "Failed to submit permissions";
//     if (error.response?.data?.MESSAGE) {
//       errorMessage = error.response.data.MESSAGE;
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     toast.error(errorMessage);
//   } finally {
//     setSubmitLoading(false);
//   }
// };

//   // Handle copy permissions
//   const handleCopyPermissions = async () => {
//     if (!sourceUserName || !targetUserName) {
//       toast.error("Please select both source and target users");
//       return;
//     }

//     if (sourceUserName === targetUserName) {
//       toast.warning("Source and target users cannot be the same");
//       return;
//     }

//     setIsCopying(true);
//     try {
//       // First, get source user permissions
//       const sourceResponse = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
//         "FLAG": "R",
//         "TBLNAME": "USERPRIVS",
//         "FLDNAME": "User_Id",
//         "ID": sourceUserName,
//         "ORDERBYFLD": "",
//         "CWHAER": "",
//         "CO_ID": ""
//       });
      
//       if (sourceResponse.data && sourceResponse.data.DATA) {
//         // Prepare payload for target user - only include modules with any permission
//         const permissionsPayload = sourceResponse.data.DATA
//           .filter(item => {
//             // Include only if any permission is "1"
//             return item.ADD_PRIV === "1" || 
//                    item.EDIT_PRIV === "1" || 
//                    item.DELETE_PRIV === "1" || 
//                    item.SELECT_PRIV === "1";
//           })
//           .map(item => ({
//             "User_Name": targetUserName,
//             "Mod_ID": item.MOD_ID,
//             "ADD_PRIV": item.ADD_PRIV,
//             "EDIT_PRIV": item.EDIT_PRIV,
//             "DELETE_PRIV": item.DELETE_PRIV,
//             "SELECT_PRIV": item.SELECT_PRIV,
//             "REPORT_PRIV": item.REPORT_PRIV || "0",
//             "ALL_PRIV": item.ALL_PRIV || "0"
//           }));
        
//         if (permissionsPayload.length === 0) {
//           toast.error("Source user has no permissions to copy");
//           return;
//         }
        
//         // Submit copied permissions
//         const submitResponse = await axiosInstance.post('/MODULE/UpsertUserPrivs', permissionsPayload);
        
//         console.log('Copy response:', submitResponse.data);
        
//         if (submitResponse.data && submitResponse.data.STATUS === "SUCCESS") {
//           toast.success("Permissions copied successfully!");
//           setCopyDialogOpen(false);
          
//           // Refresh permissions if target is currently selected
//           if (targetUserName === selectedUserName) {
//             await fetchUserPermissions(targetUserName);
//           }
//         } else {
//           const errorMessage = submitResponse.data?.MESSAGE || "Failed to copy permissions";
//           toast.error(errorMessage);
//         }
//       } else {
//         toast.error("No permissions found for source user");
//       }
//     } catch (error) {
//       console.error('Error copying permissions:', error);
//       toast.error("Failed to copy permissions");
//     } finally {
//       setIsCopying(false);
//     }
//   };

//   // Render permission buttons
//   const renderPermissionButtons = (node) => {
//     if (!node.children || node.children.length === 0) {
//       return (
//         <Box sx={{
//           display: "flex",
//           alignItems: "center",
//           ml: 1,
//           borderLeft: "1px solid #e0e0e0",
//           paddingLeft: 1,
//           height: "24px",
//           gap: 0.25
//         }}>
//           {["Add", "View", "Edit", "Delete"].map((permission) => (
//             <Box
//               key={permission}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 backgroundColor: node.permissions[permission] ? "#e3f2fd" : "#f5f5f5",
//                 borderRadius: 0.5,
//                 width: "68px",
//                 height: "22px",
//               }}
//             >
//               <Box sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "flex-start",
//                 width: "100%",
//                 pl: 0.5
//               }}>
//                 <Checkbox
//                   size="small"
//                   checked={node.permissions[permission]}
//                   onChange={(e) => handlePermissionChange(node.ModuleId, permission, e.target.checked)}
//                   sx={{
//                     padding: "2px",
//                     '& .MuiSvgIcon-root': { fontSize: 16 }
//                   }}
//                 />
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     fontSize: "0.7rem",
//                     color: node.permissions[permission] ? "#1976d2" : "text.secondary",
//                     ml: 0.25
//                   }}
//                 >
//                   {permission}
//                 </Typography>
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       );
//     }
//     return null;
//   };

//   // Render tree with compact design
// const renderTree = (nodes) => {
//   return nodes.map((node) => (
//     <Box
//       key={node.ModuleId}
//       sx={{
//         pl: node.Level * 2,
//         mt: 0,
//         borderLeft: node.Level > 0 ? "1px dashed #ddd" : "none",
//         padding: '0px',
//         '&:first-of-type': { mt: 0 }
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           minHeight: "28px",
//           maxHeight: "28px",
//           backgroundColor: node.checked ? "rgba(25, 118, 210, 0.04)" : "transparent",
//           borderRadius: 0.5,
//           '&:hover': {
//             backgroundColor: 'rgba(0, 0, 0, 0.02)'
//           }
//         }}
//       >
//         {/* Always render icon button space for alignment - FIXED */}
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center',
//           width: 32,
//           justifyContent: 'center'
//         }}>
//           {node.children && node.children.length > 0 ? (
//             <IconButton
//               onClick={() => {
//                 setMenus((prevMenus) => {
//                   const updateExpanded = (nodes) => {
//                     return nodes.map((n) => {
//                       if (n.ModuleId === node.ModuleId) {
//                         return { ...n, expanded: !n.expanded };
//                       }
//                       if (n.children) {
//                         return { ...n, children: updateExpanded(n.children) };
//                       }
//                       return n;
//                     });
//                   };
//                   return updateExpanded(prevMenus);
//                 });
//               }}
//               sx={{
//                 p: 0.25,
//                 "& svg": { fontSize: "0.9rem" }
//               }}
//             >
//               {node.expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
//             </IconButton>
//           ) : (
//             // Empty space for alignment when no children
//             <Box sx={{ width: 24, height: 24 }} />
//           )}
//         </Box>

//         <Checkbox
//           size="small"
//           checked={node.checked}
//           onChange={(e) => handleCheckboxChange(node, e.target.checked)}
//           sx={{
//             mr: 0.5,
//             padding: "2px",
//             '& .MuiSvgIcon-root': { fontSize: 18 }
//           }}
//         />

//         <Tooltip title={node.ModuleName} arrow>
//           <Typography
//             variant="body2"
//             sx={{
//               fontWeight: node.Level === 0 ? 600 : (node.Level === 1 ? 500 : 400),
//               fontSize: node.Level === 0 ? "0.8rem" : "0.75rem",
//               color: node.Level === 0 ? "#1976d2" : (node.Level === 1 ? "text.primary" : "text.secondary"),
//               minWidth: "180px",
//               maxWidth: "220px",
//               flexShrink: 0,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap"
//             }}
//           >
//             {node.ModuleName}
//           </Typography>
//         </Tooltip>

//         {/* Render permission buttons for leaf nodes only */}
//         {(!node.children || node.children.length === 0) && renderPermissionButtons(node)}
//       </Box>

//       {node.children && node.children.length > 0 && (
//         <Collapse in={node.expanded} timeout="auto" unmountOnExit>
//           <Box sx={{ ml: 0.5, mt: 0 }}>
//             {renderTree(node.children)}
//           </Box>
//         </Collapse>
//       )}
//     </Box>
//   ));
// };

//   // Initialize - fetch users on mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle user selection change
//   const handleUserChange = (userId) => {
//     const selectedUser = usersList.find(user => user.Id === userId);
//     if (selectedUser) {
//       setSelectedRoleId(userId);
//       setSelectedUserName(selectedUser.Name);
//       setSelectedRole(selectedUser.Name);
//       setSelectedUsers([userId]);
//       fetchUserPermissions(selectedUser.Name);
//     }
//   };

//   return (
//     <Box sx={{ 
//       p: 3, 
//       backgroundColor: "#F5F5F5", 
//       minHeight: "70vh",
//       overflow: "hidden",
//       display: "flex",
//       flexDirection: "column"
//     }}>
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Copy Permissions Dialog */}
//       <Dialog 
//         open={copyDialogOpen} 
//         onClose={() => setCopyDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <ContentCopyIcon />
//             Copy Permissions
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Box>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               Copy permissions from one user to another
//             </Typography>
            
//             <Box sx={{ mt: 2 }}>
//               <FormControl fullWidth variant="filled" className="custom-select" sx={{ height: '42px', mb: 2 }}>
//                 <InputLabel>Copy From (Source User)</InputLabel>
//                 <Select
//                   value={sourceUserId || ''}
//                   onChange={(e) => {
//                     const userId = e.target.value;
//                     const user = usersList.find(u => u.Id === userId);
//                     setSourceUserId(userId);
//                     setSourceUserName(user?.Name || "");
//                   }}
//                   label="Copy From (Source User)"
//                 >
//                   {usersList.map((user) => (
//                     <MenuItem key={user.Id} value={user.Id}>
//                       {user.Name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
//                 <SwapHorizIcon sx={{ color: 'action.active', fontSize: 40 }} />
//               </Box>

//               <FormControl fullWidth variant="filled" className="custom-select" sx={{ height: '42px' }}>
//                 <InputLabel>Copy To (Target User)</InputLabel>
//                 <Select
//                   value={targetUserId || ''}
//                   onChange={(e) => {
//                     const userId = e.target.value;
//                     const user = usersList.find(u => u.Id === userId);
//                     setTargetUserId(userId);
//                     setTargetUserName(user?.Name || "");
//                   }}
//                   label="Copy To (Target User)"
//                 >
//                   {usersList.map((user) => (
//                     <MenuItem key={user.Id} value={user.Id}>
//                       {user.Name} 
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Alert severity="warning" sx={{ mt: 2 }}>
//                 This will overwrite all existing permissions for the target user.
//               </Alert>
//             </Box>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCopyDialogOpen(false)} color="inherit">
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleCopyPermissions} 
//             color="primary" 
//             variant="contained"
//             disabled={!sourceUserId || !targetUserId || isCopying}
//             startIcon={isCopying ? <CircularProgress size={20} color="inherit" /> : <ContentCopyIcon />}
//           >
//             {isCopying ? "Copying..." : "Copy Permissions"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Box sx={{
//         backgroundColor: "#fff",
//         borderRadius: 1,
//         boxShadow: 1,
//         p: 2,
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden"
//       }}>
//         <Box sx={{
//           width: "100%",
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             mb: 1
//           }}>
//             <Typography variant="h6" sx={{ 
//               fontWeight: "bold", 
//               color: "#333",
//               fontSize: "1rem"
//             }}>
//               Please Select User for Permissions
//             </Typography>

//             <Tooltip title="Copy permissions to another user">
//               <Button
//                 variant="outlined"
//                 startIcon={<ContentCopyIcon />}
//                 onClick={() => setCopyDialogOpen(true)}
//                 sx={{ ml: 2 }}
//                 disabled={!selectedRoleId}
//                 size="small"
//               >
//                 Copy Permissions
//               </Button>
//             </Tooltip>
//           </Box>

//           <Box sx={{
//             width: "42.7%",
//             marginRight: "auto",
//             mb: 2
//           }}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Select User</InputLabel>
//               <Select
//                 value={selectedRoleId || ''}
//                 onChange={(e) => handleUserChange(e.target.value)}
//                 label="Select User"
//                 disabled={loading || usersList.length === 0}
//               >
//                 {loading ? (
//                   <MenuItem disabled value="">
//                     Loading users...
//                   </MenuItem>
//                 ) : usersList.length === 0 ? (
//                   <MenuItem disabled value="">
//                     No users available
//                   </MenuItem>
//                 ) : (
//                   usersList.map((user) => (
//                     <MenuItem key={user.Id} value={user.Id}>
//                       {user.Name}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>
//             </FormControl>
//           </Box>
//         </Box>

//         {selectedRoleId && (
//           <>
//             <Box sx={{ 
//               flex: 1,
//               overflow: "auto",
//               border: "1px solid #e0e0e0",
//               borderRadius: 1,
//               p: 1,
//               maxHeight: "calc(83vh - 180px)"
//             }}>
//               {permissionsLoading ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//                   <CircularProgress size={24} />
//                   <Typography variant="body2" sx={{ ml: 2 }}>
//                     Loading permissions for {selectedUserName}...
//                   </Typography>
//                 </Box>
//               ) : menus.length > 0 ? (
//                 <Box sx={{ 
//                   maxHeight: "100%",
//                   '& > div': { mb: 0 }
//                 }}>
//                   {renderTree(menus)}
//                 </Box>
//               ) : (
//                 <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
//                   No permissions found for {selectedUserName}
//                 </Typography>
//               )}
//             </Box>
//             <Box sx={{ 
//               display: 'flex', 
//               gap: 2, 
//               mt: 2,
//               pt: 2,
//               borderTop: "1px solid #e0e0e0"
//             }}>
//               <Button
//                 onClick={handleSubmit}
//                 sx={{
//                   background: "#1976D2",
//                   textTransform: "none",
//                   color: "white",
//                   "&:hover": { background: "#1565C0" },
//                   px: 3,
//                   py: 0.5,
//                   fontSize: "0.875rem",
//                   minWidth: "160px"
//                 }}
//                 disabled={submitLoading || permissionsLoading || menus.length === 0}
//                 startIcon={submitLoading ? <CircularProgress size={16} color="inherit" /> : null}
//               >
//                 {submitLoading ? "Submitting..." : "Submit Permissions"}
//               </Button>
//             </Box>
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default UserPermission;













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
  Dialog,
  CircularProgress
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from '@/lib/axios';

const UserPermission = () => {
  const [menus, setMenus] = useState([]);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [sourceUserId, setSourceUserId] = useState(null);
  const [sourceUserName, setSourceUserName] = useState("");
  const [targetUserId, setTargetUserId] = useState(null);
  const [targetUserName, setTargetUserName] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sourceUserPermissions, setSourceUserPermissions] = useState([]);
  const [targetUserPermissions, setTargetUserPermissions] = useState([]);
  const [loadingSourcePermissions, setLoadingSourcePermissions] = useState(false);
  const [loadingTargetPermissions, setLoadingTargetPermissions] = useState(false);

  // Build tree structure from flat modules array
  const buildTree = (data) => {
    const idToNodeMap = {};
    const rootNodes = [];

    // First pass: Create all nodes
    data.forEach((item) => {
      const node = {
        ...item,
        ModuleId: item.MOD_ID,
        ModuleName: item.MOD_DESC?.trim() || item.MOD_NAME?.replace('mnu', '').replace(/([A-Z])/g, ' $1').trim() || `Module ${item.MOD_ID}`,
        ParentId: item.PARENT_ID,
        Level: 0,
        children: [],
        expanded: false,
        checked: false,
        originalPermissions: {
          Add: item.ADD_PRIV === "1",
          View: item.SELECT_PRIV === "1",
          Edit: item.EDIT_PRIV === "1",
          Delete: item.DELETE_PRIV === "1"
        },
        permissions: {
          Add: item.ADD_PRIV === "1",
          View: item.SELECT_PRIV === "1",
          Edit: item.EDIT_PRIV === "1",
          Delete: item.DELETE_PRIV === "1"
        }
      };
      
      // Check if any permission is true for this node
      const hasAnyPermission = node.permissions.Add || node.permissions.View || 
                               node.permissions.Edit || node.permissions.Delete;
      node.checked = hasAnyPermission;
      
      idToNodeMap[item.MOD_ID] = node;
    });

    // Second pass: Build hierarchy
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

    // Third pass: Update parent checked status based on children
    const updateParentStatus = (node) => {
      if (node.children && node.children.length > 0) {
        let childChecked = false;
        
        node.children.forEach(child => {
          updateParentStatus(child);
          if (child.checked) {
            childChecked = true;
          }
        });
        
        // Parent should be checked if ANY child is checked
        if (childChecked) {
          node.checked = true;
        }
      }
    };

    rootNodes.forEach(node => updateParentStatus(node));

    // Sort nodes alphabetically
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

  // Convert flat permissions array to a map for easy comparison
  const permissionsToMap = (permissions) => {
    const map = {};
    if (permissions && permissions.length > 0) {
      permissions.forEach(permission => {
        map[permission.MOD_ID] = {
          ADD_PRIV: permission.ADD_PRIV || "0",
          EDIT_PRIV: permission.EDIT_PRIV || "0",
          DELETE_PRIV: permission.DELETE_PRIV || "0",
          SELECT_PRIV: permission.SELECT_PRIV || "0",
          MOD_ID: permission.MOD_ID
        };
      });
    }
    return map;
  };

  // Fetch users from API
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
        
        // Auto-select the first user (index 1 as in your original code)
        const firstUser = users[1] || users[0];
        if (firstUser) {
          setSelectedRoleId(firstUser.Id);
          setSelectedUserName(firstUser.Name);
          setSelectedRole(firstUser.Name);
          setSelectedUsers([firstUser.Id]);
          
          // Fetch permissions for first user
          await fetchUserPermissions(firstUser.Name);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async (userName) => {
    if (!userName) {
      toast.error("Please select a user first");
      return;
    }
    
    try {
      setPermissionsLoading(true);
      const response = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
        "FLAG": "R",
        "TBLNAME": "USERPRIVS",
        "FLDNAME": "User_Id",
        "ID": userName,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      });
      
      console.log('Permissions API Response:', response.data);
      
      if (response.data && response.data.DATA && response.data.DATA.length > 0) {
        // Build tree from permissions data
        const tree = buildTree(response.data.DATA);
        setMenus(tree);
        setOriginalMenus(JSON.parse(JSON.stringify(tree))); // Deep copy for comparison
      } else {
        toast.warning("No permissions found for this user");
        setMenus([]);
        setOriginalMenus([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
      setMenus([]);
      setOriginalMenus([]);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Fetch source user permissions for copy dialog
  const fetchSourceUserPermissions = async (userName) => {
    if (!userName) return;
    
    try {
      setLoadingSourcePermissions(true);
      const response = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
        "FLAG": "R",
        "TBLNAME": "USERPRIVS",
        "FLDNAME": "User_Id",
        "ID": userName,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      });
      
      console.log('Source Permissions API Response:', response.data);
      
      if (response.data && response.data.DATA) {
        setSourceUserPermissions(response.data.DATA || []);
      } else {
        setSourceUserPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching source permissions:', error);
      toast.error('Failed to load source user permissions');
      setSourceUserPermissions([]);
    } finally {
      setLoadingSourcePermissions(false);
    }
  };

  // Fetch target user permissions for copy dialog
  const fetchTargetUserPermissions = async (userName) => {
    if (!userName) return;
    
    try {
      setLoadingTargetPermissions(true);
      const response = await axiosInstance.post('/MODULE/RetriveUSERPRIVS', {
        "FLAG": "R",
        "TBLNAME": "USERPRIVS",
        "FLDNAME": "User_Id",
        "ID": userName,
        "ORDERBYFLD": "",
        "CWHAER": "",
        "CO_ID": ""
      });
      
      console.log('Target Permissions API Response:', response.data);
      
      if (response.data && response.data.DATA) {
        setTargetUserPermissions(response.data.DATA || []);
      } else {
        setTargetUserPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching target permissions:', error);
      setTargetUserPermissions([]);
    } finally {
      setLoadingTargetPermissions(false);
    }
  };

  // Compare source and target permissions to find differences
  const comparePermissions = (sourcePerms, targetPerms) => {
    const sourceMap = permissionsToMap(sourcePerms);
    const targetMap = permissionsToMap(targetPerms);
    const differences = [];
    
    // Check all modules in source
    Object.keys(sourceMap).forEach(moduleId => {
      const sourcePerm = sourceMap[moduleId];
      const targetPerm = targetMap[moduleId];
      
      // Check if permissions are different or module doesn't exist in target
      if (!targetPerm) {
        // Module doesn't exist in target, add all source permissions
        differences.push({
          moduleId,
          ...sourcePerm
        });
      } else {
        // Compare individual permissions
        const isDifferent = 
          sourcePerm.ADD_PRIV !== targetPerm.ADD_PRIV ||
          sourcePerm.EDIT_PRIV !== targetPerm.EDIT_PRIV ||
          sourcePerm.DELETE_PRIV !== targetPerm.DELETE_PRIV ||
          sourcePerm.SELECT_PRIV !== targetPerm.SELECT_PRIV;
        
        if (isDifferent) {
          differences.push({
            moduleId,
            ...sourcePerm
          });
        }
      }
    });
    
    return differences;
  };

  // Helper function to update parent status
  const updateParentStatus = (nodes, updatedNodeId) => {
    return nodes.map(node => {
      if (node.children && node.children.length > 0) {
        const updatedChildren = updateParentStatus(node.children, updatedNodeId);
        
        // Check if any child is checked
        let anyChildChecked = false;
        updatedChildren.forEach(child => {
          if (child.checked) {
            anyChildChecked = true;
          }
        });
        
        return {
          ...node,
          checked: anyChildChecked || node.checked,
          children: updatedChildren
        };
      }
      return node;
    });
  };

  // Handle permission change
  const handlePermissionChange = (moduleId, permissionType, checked) => {
    setMenus((prevMenus) => {
      const findNodeAndParents = (nodes, targetId, parents = []) => {
        for (const node of nodes) {
          if (node.ModuleId === targetId) {
            return { node, parents };
          }
          if (node.children) {
            const result = findNodeAndParents(node.children, targetId, [...parents, node]);
            if (result.node) return result;
          }
        }
        return { node: null, parents: [] };
      };

      const { node: targetNode, parents } = findNodeAndParents(prevMenus, moduleId);

      if (targetNode) {
        // Update the specific permission
        const updatedNode = {
          ...targetNode,
          permissions: {
            ...targetNode.permissions,
            [permissionType]: checked
          }
        };
        
        // Check if any permission is true
        const hasAnyPermission = Object.values(updatedNode.permissions).some(val => val);
        updatedNode.checked = hasAnyPermission;

        // Update the node in the tree
        const updateTree = (nodes) => {
          return nodes.map(n => {
            if (n.ModuleId === moduleId) {
              return updatedNode;
            }
            if (n.children) {
              return { ...n, children: updateTree(n.children) };
            }
            return n;
          });
        };

        let newTree = updateTree(prevMenus);
        
        // Update parent status
        newTree = updateParentStatus(newTree, moduleId);
        
        return newTree;
      }

      return prevMenus;
    });
  };

  // Handle checkbox change (select all permissions)
  const handleCheckboxChange = (node, checked) => {
    setMenus((prevMenus) => {
      const updateNodeAndChildren = (n, isChecked) => {
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
          children: n.children ? n.children.map(child => updateNodeAndChildren(child, isChecked)) : []
        };
      };

      const findNodeAndUpdate = (nodes) => {
        return nodes.map(n => {
          if (n.ModuleId === node.ModuleId) {
            return updateNodeAndChildren(n, checked);
          }
          if (n.children) {
            return { ...n, children: findNodeAndUpdate(n.children) };
          }
          return n;
        });
      };

      let newTree = findNodeAndUpdate(prevMenus);
      
      // Update parent status
      newTree = updateParentStatus(newTree, node.ModuleId);
      
      return newTree;
    });
  };

  // Helper function to compare if two permission objects are equal
  const arePermissionsEqual = (perm1, perm2) => {
    return perm1.Add === perm2.Add &&
           perm1.View === perm2.View &&
           perm1.Edit === perm2.Edit &&
           perm1.Delete === perm2.Delete;
  };

  // Collect only changed permissions for submission
  const collectChangedPermissions = () => {
    let permissions = [];
    
    const findNodeInOriginal = (nodes, moduleId) => {
      for (const node of nodes) {
        if (node.ModuleId === moduleId) {
          return node;
        }
        if (node.children) {
          const found = findNodeInOriginal(node.children, moduleId);
          if (found) return found;
        }
      }
      return null;
    };
    
    const traverse = (node) => {
      const originalNode = findNodeInOriginal(originalMenus, node.ModuleId);
      
      if (originalNode) {
        // Check if permissions have changed
        const permissionsChanged = !arePermissionsEqual(node.permissions, originalNode.permissions);
        
        if (permissionsChanged) {
          permissions.push({
            "User_Name": selectedUserName,
            "Mod_ID": node.ModuleId,
            "ADD_PRIV": node.permissions.Add ? "1" : "0",
            "EDIT_PRIV": node.permissions.Edit ? "1" : "0",
            "DELETE_PRIV": node.permissions.Delete ? "1" : "0",
            "SELECT_PRIV": node.permissions.View ? "1" : "0",
            "REPORT_PRIV": "0",
            "ALL_PRIV": "0"
          });
        }
      } else {
        // Node doesn't exist in original (shouldn't happen, but just in case)
        if (node.checked) {
          permissions.push({
            "User_Name": selectedUserName,
            "Mod_ID": node.ModuleId,
            "ADD_PRIV": node.permissions.Add ? "1" : "0",
            "EDIT_PRIV": node.permissions.Edit ? "1" : "0",
            "DELETE_PRIV": node.permissions.Delete ? "1" : "0",
            "SELECT_PRIV": node.permissions.View ? "1" : "0",
            "REPORT_PRIV": "0",
            "ALL_PRIV": "0"
          });
        }
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    menus.forEach(traverse);
    return permissions;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedUserName) {
      toast.error("Please select a user first");
      return;
    }

    const permissionsPayload = collectChangedPermissions();

    if (permissionsPayload.length === 0) {
      toast.warning("No changes detected for submission.");
      return;
    }

    try {
      setSubmitLoading(true);
      console.log("Submitting changed permissions:", permissionsPayload);
      
      const response = await axiosInstance.post('/MODULE/UpsertUserPrivs', permissionsPayload);
      
      console.log("Submit response:", response.data);
      
      // Check for success - either STATUS === "SUCCESS" or STATUS === 0 with success message
      if ((response.data && response.data.STATUS === "SUCCESS") || 
          (response.data && response.data.STATUS === 0 && response.data.MESSAGE && response.data.MESSAGE.includes("Success"))) {
        toast.success(response.data.MESSAGE || "Permissions submitted successfully!");
        
        // Update original menus to current state
        setOriginalMenus(JSON.parse(JSON.stringify(menus)));
        
        // Force a refresh by clearing and reloading permissions
        setMenus([]); // Clear current menus
        await fetchUserPermissions(selectedUserName); // Reload from server
        
      } else {
        // If STATUS is not SUCCESS, show error message from response if available
        const errorMessage = response.data?.MESSAGE || "Failed to submit permissions";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting permissions:', error);
      
      // Show more detailed error message
      let errorMessage = "Failed to submit permissions";
      if (error.response?.data?.MESSAGE) {
        errorMessage = error.response.data.MESSAGE;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle source user change in copy dialog
  const handleSourceUserChange = async (userId) => {
    const selectedUser = usersList.find(user => user.Id === userId);
    if (selectedUser) {
      setSourceUserId(userId);
      setSourceUserName(selectedUser.Name);
      // Fetch source user permissions
      await fetchSourceUserPermissions(selectedUser.Name);
    }
  };

  // Handle target user change in copy dialog
  const handleTargetUserChange = async (userId) => {
    const selectedUser = usersList.find(user => user.Id === userId);
    if (selectedUser) {
      setTargetUserId(userId);
      setTargetUserName(selectedUser.Name);
      // Fetch target user permissions
      await fetchTargetUserPermissions(selectedUser.Name);
    }
  };

  // Handle copy permissions
  const handleCopyPermissions = async () => {
    if (!sourceUserName || !targetUserName) {
      toast.error("Please select both source and target users");
      return;
    }

    if (sourceUserName === targetUserName) {
      toast.warning("Source and target users cannot be the same");
      return;
    }

    setIsCopying(true);
    try {
      // Wait for both source and target permissions to load
      if (loadingSourcePermissions || loadingTargetPermissions) {
        toast.info("Please wait for permissions to load");
        return;
      }

      // Compare source and target permissions to find differences
      const differences = comparePermissions(sourceUserPermissions, targetUserPermissions);
      
      console.log('Permission differences:', differences);
      
      if (differences.length === 0) {
        toast.info("No differences found. Target user already has same permissions as source user.");
        return;
      }
      
      // Prepare payload with only different permissions
      const permissionsPayload = differences.map(item => ({
        "User_Name": targetUserName,
        "Mod_ID": item.moduleId,
        "ADD_PRIV": item.ADD_PRIV || "0",
        "EDIT_PRIV": item.EDIT_PRIV || "0",
        "DELETE_PRIV": item.DELETE_PRIV || "0",
        "SELECT_PRIV": item.SELECT_PRIV || "0",
        "REPORT_PRIV": "0",
        "ALL_PRIV": "0"
      }));
      
      console.log('Copying different permissions:', permissionsPayload);
      
      // Submit only different permissions
      const submitResponse = await axiosInstance.post('/MODULE/UpsertUserPrivs', permissionsPayload);
      
      console.log('Copy response:', submitResponse.data);
      
      if (submitResponse.data && (submitResponse.data.STATUS === "SUCCESS" || submitResponse.data.STATUS === 0)) {
        toast.success(`${differences.length} permission${differences.length !== 1 ? 's' : ''} copied successfully!`);
        setCopyDialogOpen(false);
        
        // Clear states
        setSourceUserPermissions([]);
        setTargetUserPermissions([]);
        setSourceUserId(null);
        setSourceUserName("");
        setTargetUserId(null);
        setTargetUserName("");
        
        // Refresh permissions if target is currently selected
        if (targetUserName === selectedUserName) {
          await fetchUserPermissions(targetUserName);
        }
      } else {
        const errorMessage = submitResponse.data?.MESSAGE || "Failed to copy permissions";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error copying permissions:', error);
      toast.error("Failed to copy permissions");
    } finally {
      setIsCopying(false);
    }
  };

  // Calculate source user permissions count
  const sourcePermissionsCount = sourceUserPermissions.filter(item => 
    item.ADD_PRIV === "1" || 
    item.EDIT_PRIV === "1" || 
    item.DELETE_PRIV === "1" || 
    item.SELECT_PRIV === "1"
  ).length;

  // Calculate target user permissions count
  const targetPermissionsCount = targetUserPermissions.filter(item => 
    item.ADD_PRIV === "1" || 
    item.EDIT_PRIV === "1" || 
    item.DELETE_PRIV === "1" || 
    item.SELECT_PRIV === "1"
  ).length;

  // Calculate different permissions count
  const differentPermissionsCount = comparePermissions(sourceUserPermissions, targetUserPermissions).length;

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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: 32,
            justifyContent: 'center'
          }}>
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
                  "& svg": { fontSize: "0.9rem" }
                }}
              >
                {node.expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24, height: 24 }} />
            )}
          </Box>

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

          {/* Render permission buttons for leaf nodes only */}
          {(!node.children || node.children.length === 0) && renderPermissionButtons(node)}
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

  // Initialize - fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user selection change
  const handleUserChange = (userId) => {
    const selectedUser = usersList.find(user => user.Id === userId);
    if (selectedUser) {
      setSelectedRoleId(userId);
      setSelectedUserName(selectedUser.Name);
      setSelectedRole(selectedUser.Name);
      setSelectedUsers([userId]);
      fetchUserPermissions(selectedUser.Name);
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: "#F5F5F5", 
      minHeight: "70vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Copy Permissions Dialog */}
      <Dialog 
        open={copyDialogOpen} 
        onClose={() => {
          setCopyDialogOpen(false);
          setSourceUserPermissions([]);
          setTargetUserPermissions([]);
          setSourceUserId(null);
          setSourceUserName("");
          setTargetUserId(null);
          setTargetUserName("");
        }}
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
                  onChange={(e) => handleSourceUserChange(e.target.value)}
                  label="Copy From (Source User)"
                  disabled={isCopying}
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
                  onChange={(e) => handleTargetUserChange(e.target.value)}
                  label="Copy To (Target User)"
                  disabled={isCopying}
                >
                  {usersList.map((user) => (
                    <MenuItem key={user.Id} value={user.Id}>
                      {user.Name} 
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Loading indicators */}
              {(loadingSourcePermissions || loadingTargetPermissions) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading permissions...
                  </Typography>
                </Box>
              )}

              {/* Permission summary */}
              {sourceUserName && targetUserName && !loadingSourcePermissions && !loadingTargetPermissions && (
                <Box sx={{ mt: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Permission Summary:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      Source ({sourceUserName}):
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {sourcePermissionsCount} active
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      Target ({targetUserName}):
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {targetPermissionsCount} active
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" color="primary">
                      Different permissions:
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {differentPermissionsCount}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Alert severity="warning" sx={{ mt: 2 }}>
                Only different permissions will be copied to the target user.
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setCopyDialogOpen(false);
              setSourceUserPermissions([]);
              setTargetUserPermissions([]);
              setSourceUserId(null);
              setSourceUserName("");
              setTargetUserId(null);
              setTargetUserName("");
            }} 
            color="inherit"
            disabled={isCopying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCopyPermissions} 
            color="primary" 
            variant="contained"
            disabled={!sourceUserId || !targetUserId || isCopying || differentPermissionsCount === 0}
            startIcon={isCopying ? <CircularProgress size={20} color="inherit" /> : <ContentCopyIcon />}
          >
            {isCopying ? "Copying..." : `Copy ${differentPermissionsCount} Permission${differentPermissionsCount !== 1 ? 's' : ''}`}
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
                onChange={(e) => handleUserChange(e.target.value)}
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
              {permissionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading permissions for {selectedUserName}...
                  </Typography>
                </Box>
              ) : menus.length > 0 ? (
                <Box sx={{ 
                  maxHeight: "100%",
                  '& > div': { mb: 0 }
                }}>
                  {renderTree(menus)}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", py: 2 }}>
                  No permissions found for {selectedUserName}
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
                  fontSize: "0.875rem",
                  minWidth: "160px"
                }}
                disabled={submitLoading || permissionsLoading || menus.length === 0}
                startIcon={submitLoading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {submitLoading ? "Submitting..." : "Submit Permissions"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserPermission;