// tooltip code
let rooms = document.querySelector(".select-room");
// loop and add tooltip to each room
for (let room of rooms.children) {
  tippy(`#${room.id}`, {
    content: room.name,
    placement: "right-end",
  });
}
