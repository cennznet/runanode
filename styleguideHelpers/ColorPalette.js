import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-width: 10rem;
  max-width: 10rem;
  margin-top: 2rem;
`;

const Title = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ColorItem = styled.div`
  color: ${p => p.color.textColor || '#FFFFFF'};
  background-color: ${p => p.color.code};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
`;

const NameSpan = styled.span``;

const ColorPalette = ({ title, colorShades }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {colorShades.map(color => {
        return (
          <ColorItem key={color.code} {...{ color }}>
            <NameSpan>{color.name}</NameSpan>
            <span>{color.code}</span>
          </ColorItem>
        );
      })}
    </Wrapper>
  );
};

export default ColorPalette;
