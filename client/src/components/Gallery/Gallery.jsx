import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import './Gallery.css';
import PropTypes from 'prop-types';
export default function Gallery(props) {
  return (
    <ImageList sx={{ height: 450 }} cols={3} rowHeight={164}>
      {props.galleryImages.map((item) => (
        <ImageListItem key={item}>
          <img
            src={`${item}?w=164&h=164&fit=crop&auto=format`}
            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt="Gallery image"
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
Gallery.propTypes = {
  galleryImages: PropTypes.array,
};