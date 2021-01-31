 Component({
  data: {},
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },
  methods: {
    // 点击事件
    handleItemTap(e) {
      // 1.获取点击的索引
      const {index} = e.currentTarget.dataset;
      // 2.自定义事件，向父组件发送触发事件
      this.triggerEvent("tabsItemChange", {index});
    }
  }
})