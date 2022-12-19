function main() {
	const lobbyView = new LobbyView();
	const chatView = new ChatView();
	const profileView = new ProfileView();

	function renderRoute() {
		let url = window.location.hash;
		const pageView = document.getElementById("page-view");

		switch (true) {
			case url === "#/":
				emptyDOM(pageView);
				pageView.appendChild(lobbyView.elem);
				break;
			case url === "#/profile":
				emptyDOM(pageView);
				pageView.appendChild(profileView.elem);
				break;
			case url.startsWith("#/chat"):
				emptyDOM(pageView);
				pageView.appendChild(chatView.elem);
		}
	}

	renderRoute();
	window.addEventListener("popstate", renderRoute);

	cpen322.export(arguments.callee, { renderRoute, lobbyView, chatView, profileView });
}

window.addEventListener("load", main);

class LobbyView {
	constructor() {
		this.elem = createDOM(
			`<div class="content">
        <ul class="room-list">
          <li><a href="#/chat/room-1">Room 1</a></li>
          <li><a href="#/chat/room-2">Room 2</a></li>
          <li><a href="#/chat/room-3">Room 3</a></li>
        </ul>
        <div class="page-control">
          <input type="text" name="" id="create-room" placeholder="Room Name" />
          <button>Create Room</button>
        </div>
      </div>`
		);
		this.listElem = this.elem.querySelector("ul.room-list");
		this.inputElem = this.elem.querySelector("div.page-control input");
		this.buttonElem = this.elem.querySelector("div.page-control button");
	}
}

class ChatView {
	constructor() {
		this.elem = createDOM(
			`<div class="content">
          <h4 class="room-name">Italy</h4>
          <div class="message-list">
            <div class="message">
              <span class="message-user">Mario:</span>
              <span class="message-text">It's a me</span>
            </div>
            <div class="message my-message">
              <span class="message-user">Luigi:</span>
              <span class="message-text">Mama mia!</span>
            </div>
          </div>
          <div class="page-control">
            <textarea name="" id=""></textarea>
            <button>Send</button>
          </div>
        </div>`
		);
		this.titleElem = this.elem.querySelector("h4.room-name");
		this.chatElem = this.elem.querySelector("div.message-list");
		this.inputElem = this.elem.querySelector("div.page-control textarea");
		this.buttonElem = this.elem.querySelector("div.page-control button");
	}
}

class ProfileView {
	constructor() {
		this.elem = createDOM(
			`<div class="content">
        <div class="profile-form">
          <div class="form-field">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" />
          </div>
          <div class="form-field">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
          <div class="form-field">
            <label for="profile-pic">Profile picture</label>
            <input type="file" name="profile_pic" id="profile-pic" />
          </div>
        </div>
        <div class="page-control">
          <button>Create account</button>
        </div>
      </div>`
		);
	}
}

// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM(elem) {
	while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
function createDOM(htmlString) {
	let template = document.createElement("template");
	template.innerHTML = htmlString.trim();
	return template.content.firstChild;
}
