// @ts-nocheck
const catalog = {
	"Bút chì": [
		{
			image: "https://cf.shopee.vn/file/4ac06c800f9bac834e96377017087b3e",
			title: "Bút chì đen 2B thân vàng Gstar",
			price: "15000"
		},
		{
			image: "https://cf.shopee.vn/file/3dcd8374c61634a75965e88592494124",
			title: "Bút chì kim bấm Nhật A255",
			price: "15000"
		},
		{
			image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcf.shopee.vn%2Ffile%2F1708553d1f1c169450953084b956879f&f=1&nofb=1&ipt=8200bf1d7efe110c07d706343496608a6b3cf1838cc080ca26ae21210bd439cc&ipo=images",
			title: "Bút chì gỗ Uni Mitsubishi 9800",
			price: "15000"
		},
		{
			image: "https://product.hstatic.net/1000039248/product/5_2ec4d771f84c4d71803a3c19d6d8c074_1024x1024_b607023c01204046a9c6e4f9e0c9a969_1024x1024.jpg",
			title: "Bút chì bấm Thiên Long PC-026",
			price: "15000"
		},
		{
			image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-loh1knbf1jg708",
			title: "Bút chì gỗ 2B Thiên Long FO-GP02",
			price: "15000"
		}
	],
	"Hộp bút": [
		{
			image: "https://salt.tikicdn.com/cache/280x280/ts/product/cd/1b/0f/fc97fac13935187ff46604ff2e94dd18.png",
			title: "Hộp bút phiên bản Mùa Thu Vàng",
			price: "60000"
		},
		{
			image: "https://down-vn.img.susercontent.com/file/a44f0ab6c518a9c6d0000385b4bae7df",
			title: "Hộp bút nhiều ngăn đa năng",
			price: "60000"
		},
		{
			image: "https://cf.shopee.vn/file/2173abbb3901655b1116e44b33be59d7",
			title: "Hộp bút nhựa nam châm 2 mặt",
			price: "120000"
		},
		{
			image: "https://salt.tikicdn.com/ts/tmp/c5/29/af/b2c2619e24912f0b440bfc6a13b15ab8.jpg",
			title: "Hộp bút vuông 2 dây kéo",
			price: "120000"
		},
		{
			image: "https://cf.shopee.vn/file/97e9ad2f20f5e2d036faccd9eb50595e",
			title: "Hộp bút nhựa trong suốt",
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