import React from "react";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { user: JSON.parse(localStorage.getItem('user_details')).user };
    }

    handleClick = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <div id="profile" data-tab-content>
                <h2>Edit profile</h2>
                <form id="profile-form" onSubmit={this.handleClick}>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder={this.state.user.username}
                        />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            id="first_name"
                            placeholder={this.state.user.first_name}
                        />
                        <div class="error" />
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            id="last_name"
                            placeholder={this.state.user.last_name}
                        />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input
                            type="email"
                            name="Email"
                            id="email"
                            placeholder={this.state.user.email}
                        />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <label for="password">New Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="******"
                        />
                        <div class="error"></div>
                    </div>
                    <div class="form-group">
                        <label for="current password">Current Password*</label>
                        <input
                            type="password"
                            name="current password"
                            id="current_password"
                            placeholder="******"
                            required
                        />
                        <div class="error"></div>
                    </div>
                    <div class="button-group">

                        <button type="submit" class="submit" id="submit">
                            <i class="far fa-paper-plane"></i>
                            Send
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ProfilePage;