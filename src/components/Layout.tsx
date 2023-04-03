/** @jsxImportSource @emotion/react */

import Container from 'react-bootstrap/Container';

type LayoutProps = {
  children: React.ReactNode
}

const Layout = (props: LayoutProps) => (
  <Container
    css={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '1140px',
      padding: '20px 15px',
      margin: '0 auto',
      height: '100vh'
    }}
  >
    {props.children}
  </Container>
);

export default Layout;
