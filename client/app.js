cpen322.setDefault("image", "assets/people.svg");
cpen322.setDefault("testRoomId", "room-1");

const profile = { username: "Allen" };

function main() {
	const lobby = new Lobby();
	const lobbyView = new LobbyView(lobby);
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
				const roomId = url.split("/").pop();
				const currentRoom = lobby.getRoom(roomId);
				if (currentRoom) chatView.setRoom(currentRoom);
		}
	}

	renderRoute();
	window.addEventListener("popstate", renderRoute);

	cpen322.export(arguments.callee, { renderRoute, lobbyView, chatView, profileView, lobby });
}

window.addEventListener("load", main);

class Room {
	constructor(id, name, image = "assets/people.svg", messages = []) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.messages = messages;
	}

	addMessage(username, text) {
		if (text.trim() == "") return;
		const message = { username: username, text: text };
		this.messages.push(message);
		if (this.onNewMessage) {
			this.onNewMessage(message);
		}
	}
}

class Lobby {
	constructor() {
		this.rooms = {
			"room-1": new Room("room-1", "Room 1"),
			"room-2": new Room("room-2", "Room 2"),
			"room-3": new Room("room-3", "Room 3"),
			"room-4": new Room("room-4", "Room 4"),
		};
	}

	getRoom(roomId) {
		for (const id in this.rooms) {
			if (roomId === id) return this.rooms[id];
		}
	}

	addRoom(id, name, image = "assets/people.svg", messages = []) {
		this.rooms[id] = new Room(id, name, image, messages);
		if (this.onNewRoom) {
			this.onNewRoom(this.rooms[id]);
		}
	}
}

class LobbyView {
	constructor(lobby) {
		this.lobby = lobby;
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

		this.buttonElem.addEventListener("click", () => {
			const id = `room-${Object.keys(this.lobby).length + 1}`;
			const name = this.inputElem.value;
			this.lobby.addRoom(id, name);
			this.inputElem.value = "";
		});

		this.lobby.onNewRoom = (room) => {
			this.addRoomToListElem(room);
		};

		this.redrawList();
	}

	redrawList() {
		emptyDOM(this.listElem);
		for (const id in this.lobby.rooms) {
			const room = this.lobby.rooms[id];
			this.addRoomToListElem(room);
		}
	}

	addRoomToListElem(room) {
		const roomDOM = createDOM(`<li><img src=${room.image}><a href="#/chat/${room.id}">${room.name}</a></li>`);
		this.listElem.appendChild(roomDOM);
	}
}

class ChatView {
	constructor() {
		this.room = null;
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
		let self = this;

		this.buttonElem.addEventListener("click", () => {
			this.sendMessage();
		});
		this.inputElem.addEventListener("keyup", (event) => {
			if (!event.shiftKey && event.key === "Enter") {
				this.sendMessage();
			}
		});
	}

	sendMessage() {
		const message = this.inputElem.value;
		this.room.addMessage(profile.username, message);
		this.inputElem.value = "";
	}

	setRoom(room) {
		this.room = room;
		this.titleElem.textContent = room.name;
		emptyDOM(this.chatElem);

		this.room.onNewMessage = (message) => {
			this.addMessageToChatElem(message);
		};

		this.room.messages.forEach((message) => {
			this.room.onNewMessage(message);
		});
	}

	addMessageToChatElem(message) {
		let currentMessage = ``;
		if (message.username === profile.username) {
			currentMessage = createDOM(
				`<div class="message my-message">
					<span class="message-user">${message.username}</span>
					<span class="message-text">${message.text}</span>
				</div>`
			);
		} else {
			currentMessage = createDOM(
				`<div class="message">
					<span class="message-user">${message.username}</span>
					<span class="message-text">${message.text}</span>
				</div>`
			);
		}

		this.chatElem.appendChild(currentMessage);
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
