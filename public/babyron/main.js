import * as dom from '../js/utils/dom.js';
import * as storage from '../js/utils/storage.js';
import * as websocket from '../js/utils/websocket.js';
import * as event from '../js/utils/event.js'
import * as selectComponent from '../js/babylon/event/selectComponent.js'

// --------------------------------------------------
// intialize
// --------------------------------------------------
dom.setInnerText("roomId", `Room ID: ${roomId}`);
dom.setValue("username", storage.getUsername());

storage.initialize();
websocket.initialize();
event.initialize();
selectComponent.initialize();

import * as babylon from '../js/babylon/babyron.js'
