import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';

const ShelterList = ({ shelters, onEdit, onDelete, onView }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <Grid container spacing={3}>
      {shelters.map((shelter) => (
        <Grid item xs={12} sm={6} md={4} key={shelter._id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {shelter.images && shelter.images.length > 0 ? (
              <CardMedia
                component="img"
                height="200"
                image={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${shelter.images[0].url}`}
                alt={shelter.name}
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: 200,
                  backgroundColor: 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  이미지 없음
                </Typography>
              </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2">
                {shelter.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {shelter.description}
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" color="primary">
                  {formatPrice(shelter.price)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PlaceIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {shelter.location.city}, {shelter.location.province}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                <Chip
                  label={shelter.status === 'available' ? '이용 가능' : '예약됨'}
                  size="small"
                  color={shelter.status === 'available' ? 'success' : 'default'}
                />
                {shelter.youtubeUrl && (
                  <Chip label="YouTube" size="small" color="error" />
                )}
              </Box>
            </CardContent>

            <CardActions>
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => onView(shelter)}
              >
                상세
              </Button>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(shelter)}
              >
                수정
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(shelter._id)}
              >
                삭제
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShelterList;
