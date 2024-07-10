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

const details = {
	name: document.getElementById("name"),
	address: document.getElementById("address"),
	phoneNumber: document.getElementById("phoneNumber"),
	successMessage: document.querySelector("#details form p b i")
}

document.querySelector("#details form").addEventListener("submit", function() {
	const checkoutData = checkoutStore.get()
	const data = {}
	for (const id in checkoutData) {
		data[catalogData[id].title] = checkoutData[id]
	}
	console.log(
`Tên: ${details.name.value}
Địa chỉ: ${details.address.value}
Số điện thoại: ${details.phoneNumber.value}
Đơn đặt hàng: ${JSON.stringify(data)}`
	)
	for (const input of document.querySelectorAll("#details form input")) {
		input.value = ""
	}
	details.successMessage.style.display = "block"
	checkoutStore.clear()
})

document.querySelector(".navbar .btn button.store").addEventListener("click", function() {
	window.location.href = "index.html"
})

document.querySelector(".navbar .btn button.checkout").addEventListener("click", function() {
	window.location.href = "checkout.html"
})