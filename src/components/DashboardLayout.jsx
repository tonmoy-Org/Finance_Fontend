import React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../auth/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import logo from '../public/logo.png';
import { ExpandLess, ExpandMore, Menu as MenuIcon, MoreVert, } from '@mui/icons-material';
import DashboardFooter from './DashboardFooter';

const drawerWidth = 250;
const closedDrawerWidth = 70;
const mobileDrawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#f8fafc', // Light gray background
  borderRight: '1px solid rgba(0,0,0,0.08)',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

const closedMixin = (theme) => ({
  width: closedDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#f8fafc', // Light gray background
  borderRight: '1px solid rgba(0,0,0,0.08)',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 0.5),
  minHeight: 56,
  flexShrink: 0,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Permanent drawer for desktop
const PermanentDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open
      ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
      : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
  })
);

const ScrollableBox = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'transparent',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

export default function DashboardLayout({ children, title, menuItems }) {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = React.useState(!isMobile);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerAnchorEl, setDrawerAnchorEl] = React.useState(null);

  const openMenu = Boolean(anchorEl);
  const openDrawerMenu = Boolean(drawerAnchorEl);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => setOpen(!open);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerMenuClick = (event) => {
    setDrawerAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDrawerAnchorEl(null);
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  // Enhanced route matching logic
  const isRouteActive = (path) => {
    const currentPath = location.pathname;

    // Exact match
    if (currentPath === path) return true;

    // For nested routes
    if (path !== '/superadmin-dashboard' && path !== '/member-dashboard' && path !== '/client-dashboard' && currentPath.startsWith(path + '/')) {
      return true;
    }

    // Special handling for dashboard root
    if (path === '/member-dashboard' && currentPath === '/member-dashboard') {
      return true;
    }

    // For paths that are direct parent of current path
    if (path !== '/superadmin-dashboard' && path !== '/member-dashboard' && path !== '/client-dashboard' && currentPath === path) {
      return true;
    }

    return false;
  };

  const getActiveStyles = (path) => {
    const isActive = isRouteActive(path);

    if (isActive) {
      return {
        color: '#3964FE',
        backgroundColor: '#E4EDFD',
        borderLeft: '3px solid #3964FE',
        '& .MuiListItemIcon-root': {
          color: '#ffffff',
        },
        '&:hover': {
          backgroundColor: '#E4EDFD',
          color: '#3964FE',
        },
        borderRadius: '0 6px 6px 0',
        transition: 'all 0.15s ease',
        mx: 0.5,
        my: 0.25,
      };
    }

    return {
      color: '#4a5568',
      backgroundColor: 'transparent',
      '& .MuiListItemIcon-root': {
        color: '#718096',
      },
      '&:hover': {
        backgroundColor: '#e2e8f0',
        color: '#2d3748',
        '& .MuiListItemIcon-root': {
          color: '#4a5568',
        },
      },
      borderRadius: '0 6px 6px 0',
      transition: 'all 0.15s ease',
      mx: 0.5,
      my: 0.25,
    };
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const renderDrawerContent = () => (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: '#2d3748',
      '& .MuiListItemIcon-root': {
        color: 'inherit',
      },
      '& .MuiTypography-root': {
        color: 'inherit',
      },
      '& .MuiDivider-root': {
        borderColor: 'rgba(0,0,0,0.08)',
      },
    }}>
      <DrawerHeader>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          width: '100%',
          px: open ? 2 : 1,
        }}>
          {open ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '160px',
                height: 'auto',
              }}
            />
          ) : (
            <Box sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: '32px',
                  height: 'auto',
                }}
              />
            </Box>
          )}
        </Box>
      </DrawerHeader>

      <ScrollableBox sx={{ py: 0.5, my: 0.5, }}>
        {menuItems?.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {/* Section Header - Only show when drawer is open */}
            {open && section.sectionName && (
              <Box sx={{
                px: 2.5,
                py: 1,
                mb: 0.5,
              }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#718096',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  {section.sectionName}
                </Typography>
              </Box>
            )}

            {/* Section Items */}
            <List sx={{ py: 0.25 }}>
              {section.items.map((item) => {
                const isExpandable = item.isExpandable;
                const isExpanded = item.expanded;

                const mainButton = (
                  <ListItemButton
                    onClick={item.onClick}
                    sx={[
                      getActiveStyles(item.path),
                      {
                        minHeight: 44,
                        flexDirection: open ? 'row' : 'column',
                        justifyContent: open ? 'flex-start' : 'center',
                        alignItems: 'center',
                        gap: open ? 1.5 : 0.25,
                        px: open ? 2.5 : 1.5,
                        py: open ? 0.75 : 1,
                        '& .MuiListItemIcon-root': {
                          minWidth: 0,
                          mr: open ? 1.5 : 0,
                          justifyContent: 'center',
                        },
                        '& .MuiListItemText-root': {
                          m: 0,
                        },
                      },
                      isExpandable && {
                        pr: 1.5,
                      }
                    ]}
                  >
                    <ListItemIcon>
                      {React.cloneElement(item.icon, {
                        sx: {
                          fontSize: 20,
                          color: '#3964FE',
                        }
                      })}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={
                          <Typography sx={{
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: '#0F1115',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            letterSpacing: '0.01em',
                          }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    )}
                    {!open && (
                      <Typography sx={{
                        fontSize: '0.6rem',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        mt: 0.25,
                        textAlign: 'center',
                        color: 'inherit',
                        letterSpacing: '0.01em',
                      }}>
                        {item.text.split(' ').map(word => word.charAt(0)).join('')}
                      </Typography>
                    )}
                    {isExpandable && open && (
                      <ListItemIcon sx={{
                        minWidth: 0,
                        ml: 'auto',
                        color: 'inherit',
                        opacity: 0.7
                      }}>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                );

                // Wrap in tooltip for collapsed state
                const wrappedButton = open || !isMobile ? (
                  mainButton
                ) : (
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: '#2d3748',
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: '#ffffff'
                        }
                      },
                      arrow: {
                        sx: {
                          color: '#2d3748',
                        }
                      }
                    }}
                  >
                    {mainButton}
                  </Tooltip>
                );

                return (
                  <React.Fragment key={item.text}>
                    <ListItem
                      disablePadding
                      sx={{
                        display: 'block',
                      }}
                    >
                      {wrappedButton}
                    </ListItem>

                    {/* Sub-items */}
                    {isExpandable && isExpanded && item.subItems && open && (
                      <List sx={{
                        py: 0,
                        pl: 3.5,
                        backgroundColor: '#edf2f7'
                      }}>
                        {item.subItems.map((subItem) => (
                          <ListItem
                            key={subItem.text}
                            disablePadding
                            sx={{
                              display: 'block',
                            }}
                          >
                            <ListItemButton
                              onClick={subItem.onClick}
                              sx={[
                                getActiveStyles(subItem.path),
                                {
                                  minHeight: 40,
                                  px: 2.5,
                                  py: 0.5,
                                  ml: 1,
                                  '&:hover': {
                                    backgroundColor: '#e2e8f0',
                                  },
                                  '& .MuiTypography-root': {
                                    fontSize: '0.8rem',
                                  }
                                }
                              ]}
                            >
                              {subItem.icon && (
                                <ListItemIcon sx={{
                                  minWidth: 30,
                                  color: 'inherit',
                                  opacity: 0.8
                                }}>
                                  {React.cloneElement(subItem.icon, {
                                    sx: { fontSize: 18 }
                                  })}
                                </ListItemIcon>
                              )}
                              <ListItemText
                                primary={
                                  <Typography sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                    color: 'inherit',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}>
                                    {subItem.text}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </React.Fragment>
        ))}
      </ScrollableBox>

      {/* User info and logout button at bottom */}
      <Box sx={{
        p: 1.5,
        flexShrink: 0,
      }}>
        {open ? (
          // Expanded view with user info and menu
          <Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 0.5,
              mb: 0.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: '#3182ce',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#2d3748',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: '#718096',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user?.email || user?.role || 'User'}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={handleDrawerMenuClick}
                sx={{
                  color: '#718096',
                  '&:hover': {
                    backgroundColor: '#e2e8f0',
                    color: '#4a5568',
                  },
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Menu
              anchorEl={drawerAnchorEl}
              open={openDrawerMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  ml: -1,
                  minWidth: 180,
                  backgroundColor: '#ffffff',
                  color: '#2d3748',
                  border: '1px solid rgba(0,0,0,0.08)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    py: 0.75,
                    '&:hover': {
                      backgroundColor: '#f7fafc',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: 18,
                      color: '#718096',
                      mr: 1.5,
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfile}>
                <PersonIcon />
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <SettingsIcon />
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#e53e3e' }}>
                <LogoutIcon />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Collapsed view - only avatar with menu
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={handleDrawerMenuClick}
              sx={{
                width: 44,
                height: 44,
                p: 0,
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#3182ce',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={drawerAnchorEl}
              open={openDrawerMenu}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 0,
                  ml: 1,
                  minWidth: 180,
                  backgroundColor: '#ffffff',
                  color: '#2d3748',
                  border: '1px solid rgba(0,0,0,0.08)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.85rem',
                    py: 0.75,
                    '&:hover': {
                      backgroundColor: '#f7fafc',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: 18,
                      color: '#718096',
                      mr: 1.5,
                    },
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid rgba(0,0,0,0.08)` }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d3748' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#718096' }}>
                  {user?.email || user?.role || 'User'}
                </Typography>
              </Box>
              <MenuItem onClick={handleProfile}>
                <PersonIcon />
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <SettingsIcon />
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: '#e53e3e' }}>
                <LogoutIcon />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#f8fafc', // Light gray background
    }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        open={open && !isMobile}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 0.5,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{
          minHeight: 56,
          px: { xs: 1.5, sm: 2.5 },
        }}>
          {!isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                marginLeft: open ? -2 : 4.5,
                marginRight: 1.5,
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                color: '#ffffff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
                },
              }}
            >
              {open ? (
                theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />
              ) : (
                theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />
              )}
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                mr: 1.5,
                color: '#3182ce',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 600,
                color: '#0F1115',
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              Finance Dashboard
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#718096',
                fontWeight: 400,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                letterSpacing: '0.01em',
              }}
            >
              {title || 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              avatar={
                <Avatar sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.7rem',
                  bgcolor: '#3182ce',
                  color: '#ffffff',
                  fontWeight: 600,
                }}>
                  {getInitials(user?.name)}
                </Avatar>
              }
              label={user?.name}
              variant="outlined"
              onClick={handleMenuClick}
              sx={{
                borderColor: alpha('#3182ce', 0.2),
                backgroundColor: alpha('#3182ce', 0.04),
                color: '#2d3748',
                height: 36,
                cursor: 'pointer',
                '& .MuiChip-label': {
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  px: 1,
                  py: 0.5,
                },
                '&:hover': {
                  borderColor: '#3182ce',
                  backgroundColor: alpha('#3182ce', 0.08),
                },
                display: { xs: 'none', sm: 'flex' },
              }}
            />
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                color: '#718096',
                '&:hover': {
                  backgroundColor: alpha('#3182ce', 0.08),
                  color: '#3182ce',
                },
                width: 36,
                height: 36,
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.7rem',
                  bgcolor: '#3182ce',
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.06)',
              },
            }}
          >
            <MenuItem sx={{ py: 1.5, px: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }} disabled>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#718096' }}>
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleProfile} sx={{ py: 1 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings} sx={{ py: 1 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1, color: '#e53e3e' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#e53e3e' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
            disableScrollLock: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: mobileDrawerWidth,
              backgroundColor: '#f8fafc', // Light gray background for mobile
              borderRight: '1px solid rgba(0,0,0,0.08)',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            },
          }}
        >
          {renderDrawerContent()}
        </MuiDrawer>
      ) : (
        <PermanentDrawer variant="permanent" open={open}>
          {renderDrawerContent()}
        </PermanentDrawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <DrawerHeader />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 1, sm: 1.5 },
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Scrollable content area with minimal scrollbar */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1.5, sm: 2 },
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e0',
                  borderRadius: '3px',
                  '&:hover': {
                    background: '#a0aec0',
                  },
                },
                // For Firefox
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 #f1f5f9',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{
          borderTop: '1px solid rgba(0,0,0,0.04)',
          backgroundColor: '#ffffff',
          pt: 1.5,
          px: { xs: 1.5, sm: 1 },
        }}>
          <DashboardFooter />
        </Box>
      </Box>
    </Box>
  );
}