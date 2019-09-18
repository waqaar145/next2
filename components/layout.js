const Layout = (props) => {

  return (
    <div>
      <h1>
        Header
      </h1>
      {props.children}
      <h2>
        Footer
      </h2>
    </div>
  )
}

export default Layout;
