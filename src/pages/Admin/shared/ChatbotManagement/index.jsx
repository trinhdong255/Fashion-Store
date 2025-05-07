import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import DashboardLayoutWrapper from '@/layouts/DashboardLayout';

const ChatbotManagement = () => {
  const [chatbots, setChatbots] = useState([
    { id: 1, name: 'Chatbot 1', description: 'Support chatbot', status: 'ACTIVE' },
    { id: 2, name: 'Chatbot 2', description: 'Sales chatbot', status: 'INACTIVE' },
  ]);
  const [newChatbot, setNewChatbot] = useState({ name: '', description: '', status: 'ACTIVE' });
  const [editChatbot, setEditChatbot] = useState(null);
  const [searchChatbot, setSearchChatbot] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Tên', width: 150 },
    { field: 'description', headerName: 'Mô tả', width: 200 },
    { field: 'status', headerName: 'Trạng thái', width: 120 },
    { 
      field: 'actions', 
      headerName: 'Hành động', 
      width: 150, 
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditChatbot(params.row)}>Sửa</Button>
          <Button onClick={() => handleDeleteChatbot(params.row.id)} color="error">Xóa</Button>
        </>
      ),
    },
  ];

  const handleAddChatbot = () => {
    setChatbots([...chatbots, { id: chatbots.length + 1, ...newChatbot }]);
    setNewChatbot({ name: '', description: '', status: 'ACTIVE' });
    setOpenDialog(false);
  };

  const handleEditChatbot = (chatbot) => {
    setEditChatbot(chatbot);
    setNewChatbot({ name: chatbot.name, description: chatbot.description, status: chatbot.status });
    setOpenDialog(true);
  };

  const handleUpdateChatbot = () => {
    setChatbots(chatbots.map(c => (c.id === editChatbot.id ? { ...c, ...newChatbot } : c)));
    setEditChatbot(null);
    setNewChatbot({ name: '', description: '', status: 'ACTIVE' });
    setOpenDialog(false);
  };

  const handleDeleteChatbot = (id) => {
    setChatbots(chatbots.filter(c => c.id !== id));
  };

  const filteredChatbots = chatbots.filter(chatbot =>
    chatbot.name.toLowerCase().includes(searchChatbot.toLowerCase())
  );

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>Quản lý Chatbot</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tìm kiếm chatbot"
            value={searchChatbot}
            onChange={(e) => setSearchChatbot(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={() => setOpenDialog(true)} fullWidth>
            Thêm chatbot
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredChatbots}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editChatbot ? 'Sửa chatbot' : 'Thêm chatbot'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newChatbot.name}
            onChange={(e) => setNewChatbot({ ...newChatbot, name: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Mô tả"
            value={newChatbot.description}
            onChange={(e) => setNewChatbot({ ...newChatbot, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Trạng thái"
            value={newChatbot.status}
            onChange={(e) => setNewChatbot({ ...newChatbot, status: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={editChatbot ? handleUpdateChatbot : handleAddChatbot} variant="contained">
            {editChatbot ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default ChatbotManagement;