import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, Tooltip, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useNavigate } from 'react-router-dom';

const pages = ['Home', 'Repository', 'About', 'Contact','FileUpload'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const handleRedirect = (page) => {
    handleCloseNavMenu();
    if (page === 'Home')
      navigate('/');
    else
      navigate(`/${page.toLowerCase()}`);
  };

  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // State to track user authentication
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    // Implement your login logic here
    setIsAuthenticated(true);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    // Implement your logout logic here
    setIsAuthenticated(false);
    handleCloseUserMenu();
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters className='toolbar'>
          <ViewInArIcon className='logo' sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleRedirect(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ViewInArIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <MenuItem key={page} onClick={() => handleRedirect(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              </Button>
            ))}
             <Button
                  onClick={() => navigate('/teacherdashboard')}
                  sx={{ my: 2, color: 'white' }}
                >
                  <Typography textAlign="center">Teacher</Typography>
                </Button>
                <Button
                  onClick={() => navigate('/studentdashboard')}
                  sx={{ my: 2, color: 'white' }}
                >
                  <Typography textAlign="center">Student</Typography>
                </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* Conditionally render avatar and settings menu */}
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
                
                
               

              </>
            ) : (
              // Show login and signup buttons if not authenticated


              <Box display="flex" alignItems="center">
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ my: 2, mr:2, color: 'white' }}
                >
                  <Typography textAlign="center">Login</Typography>
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{ my: 2, color: 'white' }}
                >
                  <Typography textAlign="center">Signup</Typography>
                </Button>

              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
