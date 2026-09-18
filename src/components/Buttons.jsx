const Button = (context) => {
    return (
        <>
            {/* <a className="callaction px-4 py-3 rounded-3" href="contact-us.html">Contact Us</a>
            <a className="callaction px-4 py-3 rounded-3 blankBtn" href="">Discover more</a> */}
            <a className={context.className} href={context.href || context.link || '#'}>{context.text}</a>
        </>
    )
}
export default Button 
