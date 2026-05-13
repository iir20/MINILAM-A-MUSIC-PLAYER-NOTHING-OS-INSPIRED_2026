package com.minilam.os

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.background
import androidx.glance.unit.ColorProvider
import androidx.glance.text.TextStyle
import androidx.compose.ui.graphics.Color as ComposeColor

class SystemStatusWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ComposeColor.Black)
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "System Stats",
                    style = TextStyle(color = ColorProvider(ComposeColor.White))
                )
            }
        }
    }
}
