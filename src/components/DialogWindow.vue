<template>
    <b-modal @shown="onShown" @hidden="onHidden" cancel-disabled ok-disabled size="xl" centered ref="modal" :class="classes" >

                    <template #modal-header="{}">
                        <h5 class="modal-title">{{ title }}</h5>
                        <input @click="close($event)" type="button" value="X" btn-model="CLOSE" class="btn btn-dialog-close" style="position: absolute;top:0;right:0;">
                    </template>

                    <template :size="size" #default="{}">
                            <slot name="dialogBody"></slot>
                    </template>

                    <template #modal-footer="{}">
                          <div v-if="customFooter">
                            <slot name="dialogFooter"></slot>
                          </div>
                          <div v-else >
                                <b-button  v-if="!customFooter" size="sm" variant="success" @click="ok($event)">
                                    OK
                                </b-button>
                                <b-button  v-if="!customFooter" size="sm" variant="danger" @click="cancel($event)">
                                    CANCEL
                                </b-button>
                          </div>
                     </template>

     </b-modal>
</template>
<script>
export default {
    data() {
         return {
            classes : [
            ],
            dialogStyle : {
                top : this.marginTop,
            },
            dialogSizes : {
                minWidth : Math.floor(window.screen.width * (this.width/100)) + 'px',
                minHeight : Math.floor(window.screen.width * (this.height/100)) + 'px',
            }
        }
    },

    computed : {

    },


    mounted() {

    },

    props: {
        forceSize : {
            default : false
        },
        size: {
            default : 'xl'
        },
        width: {
            default : 80,
        },
        height : {
            default:  80,
        },
        data : {
          default : {}
        },
        marginTop : {
            default : '0',
        },
        title : {
            type: String,
            required: true
        },
        customFooter : {
            default : false
        },
        open : {
            default : false,
            required:  false,
        },
        onClose : {
            type: Function,
            default: () => ({}),
            required : false,
        }
    },

    methods : {

        ok : function(e) {
            this.$emit('validate', this.data);
        },

        cancel : function(e) {
            this.$emit('invalidate', this.data);
        },

        addClass : function(name) {
            this.classes.push(name)
        },

        removeClass : function(name) {
            this.classes = this.classes.filter( e => e !== name)
        },

        close : function(e) {
            this.onClose(e)
        },


        setWidth(v) {
            this.dialogStyle.minWidth = Math.floor(window.screen.width * (v/100)) + 'px';
        },

        setHeight(v) {
            this.dialogStyle.minHeight = Math.floor(window.screen.height * (v/100)) + 'px';
        },

        onShown(bvModalEvt) {
            // css hack
            Object.keys(this.dialogStyle).forEach(  e => ( this.$refs.modal.$refs.dialog.style[e] = this.dialogStyle[e] )  )

            if ( this.forceSize )
                Object.keys(this.dialogSizes).forEach(  e => ( this.$refs.modal.$refs.dialog.style[e] = this.dialogSizes[e] )  )

        },

        onHidden(bvModalEvt) {
            this.onClose(this.data)
        }

    },

    mounted() {
        if ( this.open ) {
           this.$refs.modal.show()
        }
    },

    watch : {

        open : function(v) {
            if ( v ) {
                this.$refs.modal.show()
            } else {
                this.$refs.modal.hide()
            }
        }
    }

}
</script>
