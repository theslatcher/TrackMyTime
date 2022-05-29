import React from "react";

class NavbarTab extends React.Component {
    handleClick = () => {
        const target = document.getElementById(this.props.idf);

        if (!target.classList.contains('active')) {
            //hide the tab content
            document.querySelectorAll('[data-tab-content]').forEach((tabContent) => {
                tabContent.classList.remove('active')
            })

            //show the tab content when click on target tab
            target.classList.add('active')
        }
    }

    render() {
        return (<li data-tab-target={`#${this.props.idf}`} class="tab" onClick={this.handleClick}>{this.props.name}</li>);
    }
}

export default NavbarTab;