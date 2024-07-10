// @ts-nocheck
const catalog = {
	"Bút chì": [
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220810/22073372_thumb.JPG",
			title: "Bút chì khúc Hello Kitty",
			price: "15000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220810/22073371_thumb.JPG",
			title: "Bút chì khúc Khủng long dinosaur đội mũ party",
			price: "15000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220810/22073370_thumb.JPG",
			title: "Bút chì khúc Unicorn sweet dream",
			price: "15000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220715/22070121_thumb.JPG",
			title: "Bút chì MJ vĩnh cửu Rabbit new world",
			price: "15000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220718/22070120_thumb.JPG",
			title: "Bút chì MJ vĩnh cửu I love duck",
			price: "15000"
		}
	],
	"Hộp bút": [
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220806/22070719_thumb.JPG",
			title: "Hộp bút MJ Rabbit carrot planet heart line 8x19",
			price: "60000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220806/22070718_thumb.jpg",
			title: "Hộp bút MJ Baby bear I am happy 4x8x20",
			price: "60000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220806/22070615_thumb.JPG",
			title: "Hộp bút lớn Hello I'm bear 7x11x22",
			price: "120000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220802/22070402_thumb.JPG",
			title: "Hộp bút lớn Rabbit flower fruit 5x12x21",
			price: "120000"
		},
		{
			image: "https://img.cdn.vncdn.io/nvn/ncdn/store/7534/ps/20220802/22070401_thumb.JPG",
			title: "Hộp bút MJ Sheep good night 3x8x21",
			price: "80000"
		},
	]
}

const catalogData = {}

{
	let i = 0
	for (const category in catalog) {
		for (const item of catalog[category]) {
			catalogData[i] = item
			item.id = i
			i++
		}
	}
}

const priceFormatter = new Intl.NumberFormat("vi-VN", {
	style: "currency",
	currency: "VND"
})

const checkoutStore = {
	localStore: {},
	get: function() {
		return this.localStore
	},
	save: function() {
		localStorage.setItem("checkout", JSON.stringify(this.localStore))
	},
	append: function(id) {
		if (!this.localStore[id]) {
			this.localStore[id] = 1
			this.save()
		}
	},
	remove: function(id) {
		if (this.localStore[id]) {
			delete this.localStore[id]
			this.save()
		}
	},
	setQuantity: function(id, quantity) {
		this.localStore[id] = quantity
		this.save()
	},
	clear: function() {
		this.localStore = {},
		this.save()
	}
}

if (localStorage.getItem("checkout")) {
	checkoutStore.localStore = JSON.parse(localStorage.getItem("checkout"))
} else {
	localStorage.setItem("checkout", JSON.stringify([]))
}

const cover = document.getElementById("cover")

function toggleCover(state) {
	if (state) {
		cover.style.display = "block"
	} else {
		cover.style.display = "none"
	}
}

const itemFocus = {
	item: document.getElementById("focused-item"),
	container: document.getElementById("focused-item-container"),
	image: document.querySelector("#focused-item .image img"),
	title: document.querySelector("#focused-item .title h2"),
	price: document.querySelector("#focused-item .price h2"),
	button: document.querySelector("#focused-item .add-to-cart button"),
	currentItem: {},
	set: function(item) {
		this.currentItem = item
		const {id, image, title, price} = item
		this.image.src = image
		this.title.textContent = title
		this.price.textContent = `Giá: ${priceFormatter.format(price)}`
		if (checkoutStore.get()[id]) {
			this.button.classList.add("clicked")
		} else {
			this.button.classList.remove("clicked")
		}
	},
	getId: function() {
		return this.currentItem.id
	},
	toggle: function(state) {
		toggleCover(state)
		if (state) {
			this.container.style.display = "flex"
		} else {
			this.container.style.display = "none"
		}
	}
}

function createItem({image, title, price}) {
	const template = document.getElementById("item-template").content.firstElementChild.cloneNode(true)
	template.querySelector(".image img").src = image
	template.querySelector(".title h2").textContent = title
	template.querySelector(".price h2").textContent = `Giá: ${priceFormatter.format(price)}`
	return template
}
function createDropdown(name) {
	const template = document.getElementById("button-template").content.cloneNode(true)
	const button = template.querySelector("button")
	button.textContent = name
	button.addEventListener("click", function() {
		this.classList.toggle("active")
		let content = this.nextElementSibling
		if (content.style.maxHeight !== "0px") {
			content.style.maxHeight = "0px"
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	})
	return template
}

for (const categoryName in catalog) {
	const category = createDropdown(categoryName)
	for (const item of catalog[categoryName]) {
		const createdItem = createItem(item) 
		createdItem.addEventListener("click", function() {
			itemFocus.set(item)
			itemFocus.toggle(true)
		})
		category.querySelector("div").append(createdItem)
	}
	document.querySelector(".catalog-container").append(category)
}

document.querySelector("#focused-item .close button").addEventListener("click", function() {
	itemFocus.toggle(false)
})

document.querySelector("#focused-item .add-to-cart button").addEventListener("click", function() {
	if (this.classList.contains("clicked")) {
		checkoutStore.remove(itemFocus.getId())
	} else {
		checkoutStore.append(itemFocus.getId())
	}
	this.classList.toggle("clicked")
})

document.querySelector(".navbar .btn button").addEventListener("click", function() {
	window.location.href = "checkout.html"
})