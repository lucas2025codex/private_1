import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
  Alert,
  Input,
} from '@mui/material';
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShelterList from '../components/ShelterList';
import ShelterForm from '../components/ShelterForm';
import { shelterService } from '../services/shelterService';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [currentShelter, setCurrentShelter] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadShelters();
  }, [page, navigate]);

  const loadShelters = async () => {
    try {
      setLoading(true);
      const response = await shelterService.getShelters(page, 9);
      setShelters(response.data);
      setTotalPages(response.pages);
      setError('');
    } catch (err) {
      setError('농막 목록을 불러오는데 실패했습니다.');
      toast.error('농막 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleOpenForm = (shelter = null) => {
    setCurrentShelter(shelter);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentShelter(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentShelter) {
        await shelterService.updateShelter(currentShelter._id, formData);
        toast.success('농막이 수정되었습니다.');
      } else {
        await shelterService.createShelter(formData);
        toast.success('농막이 등록되었습니다.');
      }
      handleCloseForm();
      loadShelters();
    } catch (err) {
      toast.error(
        err.response?.data?.message || '작업에 실패했습니다.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await shelterService.deleteShelter(id);
        toast.success('농막이 삭제되었습니다.');
        loadShelters();
      } catch (err) {
        toast.error('삭제에 실패했습니다.');
      }
    }
  };

  const handleView = (shelter) => {
    setCurrentShelter(shelter);
    setOpenImageUpload(true);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('이미지를 선택해주세요.');
      return;
    }

    try {
      await shelterService.uploadImages(currentShelter._id, selectedFiles);
      toast.success('이미지가 업로드되었습니다.');
      setOpenImageUpload(false);
      setSelectedFiles([]);
      loadShelters();
    } catch (err) {
      toast.error('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            농막 관리 시스템
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">농막 관리</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            농막 등록
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <ShelterList
              shelters={shelters}
              onEdit={handleOpenForm}
              onDelete={handleDelete}
              onView={handleView}
            />

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
          <DialogContent>
            <ShelterForm
              initialData={currentShelter}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openImageUpload}
          onClose={() => setOpenImageUpload(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>이미지 업로드</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Input
                type="file"
                inputProps={{ multiple: true, accept: 'image/*' }}
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                선택된 파일: {selectedFiles.length}개
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImageUpload(false)}>취소</Button>
            <Button
              onClick={handleImageUpload}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              업로드
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default Dashboard;
