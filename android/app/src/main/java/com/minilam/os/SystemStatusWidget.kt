package com.minilam.os

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color as ComposeColor
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.background
import androidx.glance.unit.ColorProvider
import androidx.glance.text.TextStyle
import androidx.glance.text.FontWeight
import androidx.glance.text.TextAlign

class SystemStatusWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ComposeColor.Black)
                    .padding(12.dp)
            ) {
                Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "MINILAM_DIAGNOSTICS",
                        style = TextStyle(color = ColorProvider(ComposeColor(0xFFFF3B30)), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    Box(modifier = GlanceModifier.size(6.dp).background(ComposeColor(0xFFFF3B30))) {}
                }
                
                Spacer(modifier = GlanceModifier.height(12.dp))
                
                StatusRow("BATTERY", "87%", 0.87f)
                StatusRow("MEMORY", "2.4GB", 0.35f)
                StatusRow("STORAGE", "128GB", 0.62f)
                StatusRow("CPU_LOAD", "LOW", 0.12f)
                
                Spacer(modifier = GlanceModifier.defaultWeight())
                
                Text(
                    text = "ENVIRONMENT // RAIN_MODE",
                    style = TextStyle(color = ColorProvider(ComposeColor.White.copy(alpha = 0.4f)), fontSize = 8.sp)
                )
            }
        }
    }

    @Composable
    private fun StatusRow(label: String, value: String, progress: Float) {
        Column(modifier = GlanceModifier.fillMaxWidth().padding(vertical = 6.dp)) {
            Row(modifier = GlanceModifier.fillMaxWidth()) {
                Text(text = label, style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 8.sp, fontWeight = FontWeight.Medium))
                Spacer(modifier = GlanceModifier.defaultWeight())
                Text(text = value, style = TextStyle(color = ColorProvider(ComposeColor.White), fontSize = 8.sp))
            }
            Spacer(modifier = GlanceModifier.height(4.dp))
            // Simulating progress bar with a background and a fixed width percentage
            Box(
                modifier = GlanceModifier.fillMaxWidth().height(2.dp).background(ComposeColor.White.copy(alpha = 0.1f))
            ) {
                // Since weight doesn't work, we'll just show the header or use a simplified visual
                Box(
                    modifier = GlanceModifier.fillMaxWidth().height(2.dp).background(ComposeColor(0xFFFF3B30).copy(alpha = 0.5f))
                ) {}
            }
        }
    }
}
