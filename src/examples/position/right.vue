<template>
  <ioc-editor-right #default="{ selectComponent }">
    <div class="info" v-if="selectComponent">
      <FormModel
        :model="formValues"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <FormItem label="标题" prop="title">
          <Input v-model="formValues.title"/>
        </FormItem>
        <FormItem label="位置" prop="position">
          <FormItem label="x" prop="x">
            <InputNumber v-model="formValues.position.x"/>
          </FormItem>
          <FormItem label="y" prop="y">
            <InputNumber v-model="formValues.position.y"/>
          </FormItem>
        </FormItem>
        <FormItem label="尺寸" prop="size">
          <FormItem label="宽度" prop="width">
            <InputNumber v-model="formValues.size.width"/>
          </FormItem>
          <FormItem label="高度" prop="height">
            <InputNumber v-model="formValues.size.height"/>
          </FormItem>
        </FormItem>
      </FormModel>
    </div>
    <div v-else>
      右侧配置栏
    </div>
  </ioc-editor-right>
</template>

<script>
import { FormModel, Input, InputNumber } from 'ant-design-vue'
import { IocEditorRight } from '@'
export default {
  name: 'right',

  components: {
    IocEditorRight,
    FormModel,
    FormItem: FormModel.Item,
    Input,
    InputNumber
  },

  inject: ['iocEditor', 'updateComponent'],

  data () {
    return {
      form: this.$form.createForm(this, { name: 'setting' }),
      formValues: {}
    }
  },

  watch: {
    'iocEditor.selectComponent': {
      handler: function (val = {}) {
        this.formValues = val
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    onChange (value) {
      this.updateComponent(value)
    }
  }
}
</script>
